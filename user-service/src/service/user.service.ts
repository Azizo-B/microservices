import { Token, User } from "@prisma/client";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { verifyJWT } from "../core/jwt";
import { getLogger } from "../core/logging";
import { hashPassword, verifyPassword } from "../core/password";
import ServiceError from "../core/serviceError";
import { prisma } from "../data";
import { UserLoginInput, UserSigninInput } from "../types/user.types";
import * as tokenService from "./token.service";

export async function getAllUsers(): Promise<User[]> {
  const users = await prisma.user.findMany();
  return users;
}

// TODO: extract user account creation to its own service
export async function createUser(userSigninInput: UserSigninInput): Promise<User> {
  let user = await prisma.user.findUnique({ where: { email: userSigninInput.email } });

  if (!user) {
    user = await prisma.user.create({data: { email: userSigninInput.email }});
  }

  const passwordHash = await hashPassword(userSigninInput.password);
  await prisma.userAccount.create({
    data: { 
      userId: user.id, appId: userSigninInput.appId, username: userSigninInput.username, passwordHash, 
    },
  });

  return user;
}

export const login = async (userLoginInput: UserLoginInput): Promise<string> => {
  const user = await prisma.user.findUnique({ where: { email: userLoginInput.email } });

  if (!user) {
    throw ServiceError.unauthorized("The given email and password do not match.");
  }

  const useraccount = await prisma.userAccount.findUnique(
    { where: { idx_unique_user_app_account: { userId: user.id, appId: userLoginInput.appId } }, 
    });

  if (!useraccount) {
    throw ServiceError.unauthorized("The given email and password do not match.");
  }
    
  const passwordValid = await verifyPassword(userLoginInput.password, useraccount.passwordHash);

  if (!passwordValid) {
    throw ServiceError.unauthorized("The given email and password do not match.");
  }

  const token = await tokenService.createToken(user.id, { type: "session", appId: userLoginInput.appId });
  return token.token;
};

export const checkAndParseToken = async (authHeader?: string): Promise<string> => {
  if (!authHeader) {
    throw ServiceError.unauthorized("You need to be signed in.");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw ServiceError.unauthorized("Invalid authentication token.");
  }

  const authToken = authHeader.substring(7);

  try {
    const { sub } = await verifyJWT(authToken);

    return sub || "";
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

export async function checkPermission(permission: string, userId: string): Promise<boolean> {
  
  const user = await prisma.user.findUnique({ 
    where: { id: userId }, 
    include: { 
      roles: { 
        include: { role: { include: { rolePermission: {include: { permission: true } } } } }, 
      }, 
    }, 
  });
  
  if (!user) {
    throw ServiceError.notFound("User not found");
  };
  
  const permissions = user.roles.flatMap((userRole) =>
    userRole.role.rolePermission.map((rp) => rp.permission.name),
  );
  
  return permissions.includes(permission);
};

export async function getUserRolesAndPermissions(id: string) {
  const user = await prisma.user.findUnique({ 
    where: { id }, 
    include: { 
      roles: { 
        include: { role: { include: { rolePermission: {include: { permission: true } } } } }, 
      }, 
    }, 
  });

  if (!user) {
    return {roles: [], permissions: []};
  }
  const roles = user.roles.map((userRole) => userRole.role.name);
  
  const permissions = user.roles.flatMap((userRole) =>
    userRole.role.rolePermission.map((rp) => rp.permission.name),
  );
  return {roles, permissions};
}

// TODO: add verification for tokens based on passed token in query params
export async function verifyEmail (token: string): Promise<Token> {
  try {
    const { sub, jwtid } = await verifyJWT(token);

    const dbToken = await prisma.token.findUnique({ where: { id: jwtid } });

    if (!dbToken) {
      throw ServiceError.validationFailed("Token not found.");
    }

    if (dbToken.revokedAt) {
      throw ServiceError.validationFailed("Token has been revoked.");
    }
    
    await prisma.user.update({ where: { id: sub }, data: { isVerified: true } });
    await prisma.token.update({ where: { id: jwtid }, data: { revokedAt:  new Date() } });

    return dbToken;
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      throw ServiceError.validationFailed("The token has expired.");
    } else if (error instanceof JsonWebTokenError) {
      throw ServiceError.unauthorized(`Invalid token: ${error.message}`);
    } else {
      throw ServiceError.unauthorized(error.message);
    }
  }
};