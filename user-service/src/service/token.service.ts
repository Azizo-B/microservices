import { Token } from "@prisma/client";
import config from "config";
import { generateJWT } from "../core/jwt";
import ServiceError from "../core/serviceError";
import { prisma } from "../data";
import { CreateTokenInput, TokenFiltersWithPagination, TokenWithStatus } from "../types/token.types";
import handleDBError from "./_handleDBError";
import { checkPermission } from "./user.service";

const JWT_EXPIRATION_INTERVAL = config.get<number>("auth.jwt.expirationInterval");

export async function createToken(userId: string, createTokenInput: CreateTokenInput): Promise<Token> {
  try{
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw ServiceError.notFound("User not found.");
    }
    
    const tokenRecord = await prisma.token.create({
      data: {
        type: createTokenInput.type,
        expiresAt: new Date(Date.now() + JWT_EXPIRATION_INTERVAL * 1000),
        token: "",
        user: { connect: { id: userId } },
        ...(createTokenInput.deviceId && { device: { connect: { id: createTokenInput.deviceId } } }),
        application: { connect: { id: createTokenInput.appId } },
      },
    });

    const tokenString = await generateJWT(user.id, tokenRecord.id);

    await prisma.token.update({
      where: { id: tokenRecord.id },
      data: { token: tokenString },
    });

    tokenRecord.token = tokenString;
    
    return tokenRecord;
  }catch(error){
    handleDBError(error);
  }
}

export async function getAllTokens(userId: string, filters: TokenFiltersWithPagination): Promise<Token[]> {
  const { page = 1, limit = 10, ...remainingFilters } = filters;
  const skip = (page - 1) * limit;
  const filter: any = {where:{...remainingFilters}, skip, take: limit};
  
  const hasPermission = await checkPermission("userservice:list:any:token", userId);
  if(!hasPermission){
    filter.where.userId = userId;
  }

  return await prisma.token.findMany(filter);
}

// TODO: remove appid from response
export async function getTokenById(userId: string, id: string): Promise<TokenWithStatus> {
  const token = await prisma.token.findUnique(
    { where: { id }, include: { device:true, application:true }},
  );
  
  if (!token) {
    throw ServiceError.notFound("Token not found.");
  }

  const hasPermission = await checkPermission("userservice:read:any:token", userId);

  if(token.userId !== userId && !hasPermission){
    throw ServiceError.notFound("Token not found."); // dont give away that token exists
  }
  
  let isValid = true;
  let detail = null;

  if (token.expiresAt < new Date()) {
    isValid = false;
    detail = "expired";
  }
  if (token.revokedAt) {
    isValid = false;
    detail = "revoked";
  }

  return {...token, isValid, detail};
}

export async function deleteToken(userId: string, tokenId: string): Promise<void> {
  try{
    const hasPermission = await checkPermission("userservice:delete:any:token", userId);
    const token = await prisma.token.findUnique({ where: { id: tokenId } });
  
    if (!token) {
      throw ServiceError.notFound("Token not found.");
    }
  
    if(userId !== token.userId && !hasPermission){
      throw ServiceError.notFound("Token not found."); // dont give away that token exists
    }

    await prisma.token.update({ where: { id: tokenId }, data: { revokedAt: new Date() } });
  }catch(error){
    handleDBError(error);
  }
}

export async function linkTokenToDevice(tokenId: string, deviceId: string): Promise<void> {
  await prisma.token.update({where: { id: tokenId }, data: { device: { connect: {id: deviceId }}}});
}