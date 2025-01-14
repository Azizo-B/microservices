import { User } from "@prisma/client";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { verifyJWT } from "../core/jwt";
import { getLogger } from "../core/logging";
import { hashPassword, verifyPassword } from "../core/password";
import ServiceError from "../core/serviceError";
import { prisma } from "../data";
import { TokenType } from "../types/token.types";
import {
  AccountStatus, GetUserByIdResponse,
  PublicUser,
  UserLoginInput, UserSignupInput, UserUpdateInput,
} from "../types/user.types";
import handleDBError from "./_handleDBError";
import * as tokenService from "./token.service";

function makePublicUser(user: User): PublicUser{
  const publicUser = {...user};
  delete (publicUser as any).passwordHash; 
  return publicUser;
}

export async function createUser(userSignupInput: UserSignupInput): Promise<PublicUser> {
  try{
    const user = await prisma.user.findUnique({
      where: { 
        idx_unique_user_email_app_account: { email: userSignupInput.email, appId: userSignupInput.appId },
      },
    });

    if (user) {
      throw ServiceError.conflict("A user with this email already exists.");
    }

    const passwordHash = await hashPassword(userSignupInput.password);
    return makePublicUser(
      await prisma.user.create({
        data: { 
          email: userSignupInput.email, 
          username: userSignupInput.username, 
          passwordHash, 
          application:{ connect: { id: userSignupInput.appId } },
        },
      }),
    );
  }catch(error){
    handleDBError(error);
  }
}

// TODO : restrict deleted account / "inactive"
export const login = async (userLoginInput: UserLoginInput, deviceId?: string) => {
  const user = await prisma.user.findUnique({
    where: { 
      idx_unique_user_email_app_account:{ email: userLoginInput.email, appId: userLoginInput.appId },
    },
  });

  if (!user) {
    throw ServiceError.unauthorized("The given email and password do not match.");
  }

  if (!user.isVerified) {
    throw ServiceError.unauthorized("Your email address is not verified. Please verify it before logging in.");
  }
    
  const passwordValid = await verifyPassword(userLoginInput.password, user.passwordHash);

  if (!passwordValid) {
    throw ServiceError.unauthorized("The given email and password do not match.");
  }

  if (user.status === AccountStatus.BANNED) {
    throw ServiceError.unauthorized("This account has been banned.");
  }
  
  const token = await tokenService.createToken(
    user.id, { type: TokenType.SESSION, appId: userLoginInput.appId, deviceId: deviceId },
  );

  return token;
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

export async function getAllUsers(): Promise<PublicUser[]> {
  const users = await prisma.user.findMany();
  const publicUsers = users.map((u)=> makePublicUser(u));
  return publicUsers;
}

export async function getUserById(id: string, requestingUserId: string): Promise<GetUserByIdResponse> {
  id = id === "me" ? requestingUserId : id;

  if (id !== requestingUserId && ! await checkPermission("userservice:read:any:user", requestingUserId)) {
    throw ServiceError.notFound("User not found"); // Do not leak user information
  }

  const { roles, permissions } = await getUserRolesAndPermissions(id);

  const user = await prisma.user.findUnique({ 
    where: { id }, 
    include: { 
      application: {select:{name: true}},
      devices: { 
        select: {
          id: true,
          userAgent: true,
          deviceType: true,
          os: true,
          osVersion: true,
          browser: true,
          browserVersion: true,
          city: true,
          country: true,
          ips: { select: { ipAddress: true } },
        }, 
      }, 
    }, 
  });

  if (!user) {
    throw ServiceError.notFound("User not found");
  }
  // TODO: remove casting fix type 
  return { 
    id: user.id,
    username: user.username,
    email: user.email,
    status: user.status,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    application: user.application.name,
    profile: user.profile,
    devices: user.devices.map((device) => ({
      ...device,
      ips: device.ips.map((ip) => ip.ipAddress),
    })),
    roles,
    permissions,
  } as GetUserByIdResponse;
}

export function updateUserById(id: string, userUpdateInput: UserUpdateInput) {
  return prisma.user.update({ where: { id }, data: { ...userUpdateInput } });
}

export async function getUserProfile(id: string, requestingUserId: string) {
  id = id === "me" ? requestingUserId : id;

  if (id !== requestingUserId && ! await checkPermission("userservice:read:any:profile", requestingUserId)) {
    throw ServiceError.notFound("User not found"); // Do not leak user information
  }

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw ServiceError.notFound("User not found");
  }

  return user.profile;
}

export async function updateUserProfile(id: string, profile: any, requestingUserId: string): Promise<User> {
  id = id === "me" ? requestingUserId : id;

  if (id !== requestingUserId && ! await checkPermission("userservice:update:any:profile", requestingUserId)) {
    throw ServiceError.notFound("User not found"); // Do not leak user information
  }

  const user = await prisma.user.update({ where: { id }, data: { profile } });

  return user;
}

export async function linkRoleToUser(userId: string, roleId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    const role = await prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new Error("Role not found");
    }

    await prisma.userRole.create({
      data: {
        user: { connect: { id: userId } },
        role: { connect: { id: roleId } },
      },
    });
  } catch (error) {
    handleDBError(error);
  }
}

export async function unlinkRoleFromUser(userId: string, roleId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    await prisma.userRole.delete({
      where: { idx_unique_roles_on_user:{ userId, roleId } },
    });
  } catch (error) {
    handleDBError(error);
  }
}

export async function validateToken(token: string): Promise<{userId: string, jwtid: string}>{
  try {
    const { sub, jwtid } = await verifyJWT(token);

    const dbToken = await prisma.token.findUnique({ where: { id: jwtid } });

    if (!dbToken) {
      throw ServiceError.validationFailed("Token not found.");
    }

    if (dbToken.revokedAt) {
      throw ServiceError.validationFailed("Token has been revoked.");
    }

    if(!sub){
      throw ServiceError.validationFailed("Token has no subject.");
    }
    
    await prisma.token.update({ where: { id: jwtid }, data: { revokedAt:  new Date() } });

    return {userId: sub, jwtid};
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

export async function verifyEmail(token: string): Promise<{userId: string, jwtid: string}> {
  try {
    const tokenInfo = await validateToken(token);
    await prisma.user.update({ where: { id: tokenInfo.userId }, data: { isVerified: true } });
    return tokenInfo;
  } catch (error: any) {
    handleDBError(error);
  }
};

export async function resetPassword(token: string, newPassword: string): Promise<{userId: string, jwtid: string}> {
  try {
    const tokenInfo = await validateToken(token);
    const newPasswordHash = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: tokenInfo.userId }, data: { passwordHash: newPasswordHash } });
    return tokenInfo;
  } catch (error: any) {
    handleDBError(error);
  }
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