import { Token } from "@prisma/client";
import config from "config";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { generateJWT, verifyJWT } from "../core/jwt";
import { publishEvent } from "../core/kafka";
import { getLogger } from "../core/logging";
import ServiceError from "../core/serviceError";
import { prisma } from "../data";
import { CreateTokenInput, TokenFiltersWithPagination, TokenType, TokenWithStatus } from "../types/token.types";
import handleDBError from "./_handleDBError";
import { checkPermission } from "./user.service";

const ENV = config.get<string>("env");
const JWT_EXPIRATION_INTERVAL = config.get<number>("auth.jwt.expirationInterval");

export async function createToken(createTokenInput: CreateTokenInput): Promise<Token> {
  try{
    const user = await prisma.user.findUnique({ where: { id: createTokenInput.userId } });

    if (!user) {
      throw ServiceError.notFound("User not found.");
    }
    
    const tokenRecord = await prisma.token.create({
      data: {
        type: createTokenInput.type,
        expiresAt: new Date(Date.now() + JWT_EXPIRATION_INTERVAL * 1000),
        token: "",
        user: { connect: { id: createTokenInput.userId } },
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

    switch (tokenRecord.type) {
      case TokenType.EMAIL_VERIFICATION:
        await publishEvent(`${ENV}.user-service.verification-token.created`, {
          userId: tokenRecord.userId,
          tokenId: tokenRecord.id,
        });
        break;
      case TokenType.PASSWORD_RESET:
        await publishEvent(`${ENV}.user-service.reset-token.created`, {
          userId: tokenRecord.userId,
          tokenId: tokenRecord.id,
        });
        break;
    }
    
    return tokenRecord;
  }catch(error){
    handleDBError(error);
  }
}

export async function getAllTokens(userId: string, filters: TokenFiltersWithPagination): Promise<Token[]> {
  const { page = 0, limit = 10, ...remainingFilters } = filters;
  const skip = page * limit;
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

export async function parseToken(authHeader?: string): Promise<string> {
  if (!authHeader) {
    throw ServiceError.unauthorized("You need to be signed in.");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw ServiceError.unauthorized("Invalid authentication token.");
  }

  return authHeader.substring(7);
}

export const checkToken = async (token: string): Promise<string> => {
  try {
    const { sub, jti } = await verifyJWT(token);

    if (!jti || !sub) {
      throw ServiceError.unauthorized("Invalid authentication token.");
    }

    const dbToken = await prisma.token.findUnique({ where: { id: jti } });

    if (!dbToken) {
      throw ServiceError.unauthorized("Invalid authentication token.");
    }

    if (dbToken.revokedAt) {
      throw ServiceError.unauthorized("The token has been revoked.");
    }

    return sub;
  } catch (error: any) {
    getLogger().error(error.message, { error });

    if (error instanceof TokenExpiredError) {
      throw ServiceError.unauthorized("The token has expired.");
    } else if (error instanceof JsonWebTokenError) {
      throw ServiceError.unauthorized(`Invalid authentication token: ${error.message}`);
    } else {
      throw ServiceError.unauthorized(error.message);
    }
  }
};