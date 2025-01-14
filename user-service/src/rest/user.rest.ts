import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import Joi from "joi";
import { authDelay, requireAuthentication, requirePermission } from "../core/auth";
import { collectDeviceInfo } from "../core/collectDeviceInfo";
import validate, { objectIdValidation } from "../core/validation";
import { createDevice } from "../service/device.service";
import * as userService from "../service/user.service";
import { EntityId, ListResponse } from "../types/common.types";
import { AccountStatus, GetUserByIdResponse, PublicUser, UserSignupInput, UserUpdateInput } from "../types/user.types";

async function createUser(req: Request<{}, {}, UserSignupInput>, res: Response, next: NextFunction) {
  try {
    const user = await userService.createUser(req.body);
    req.userId = user.id;
    await createDevice(req);
    res.send(user);
  } catch (error) {
    next(error);
  }
}
createUser.validationSchema = { 
  body: { 
    appId: objectIdValidation, 
    username: Joi.string(),
    email: Joi.string().email().lowercase(), 
    password: Joi.string(),
  },
};
async function verifyEmail(req: Request<{}, {}, {token:string}>, res: Response, next: NextFunction) {
  try {
    const { userId } = await userService.verifyEmail(req.body.token);
    req.userId = userId;
    await createDevice(req);
    res.send();
  } catch (error) {
    next(error);
  }
}
verifyEmail.validationSchema = { body: { token: Joi.string() } };

async function resetPassword(
  req: Request<{}, {}, {token:string, newPassword: string}>, res: Response, next: NextFunction,
) {
  try {
    const { userId } = await userService.resetPassword(req.body.token, req.body.newPassword);
    req.userId = userId;
    await createDevice(req);
    res.send();
  } catch (error) {
    next(error);
  }
}
resetPassword.validationSchema = { body: { token: Joi.string(),  newPassword: Joi.string()} };

async function getAllUsers(_: Request, res: Response<ListResponse<PublicUser>>, next: NextFunction) {
  try {
    const users = await userService.getAllUsers();
    res.send({items: users});
  } catch (error) {
    next(error);
  }
}
getAllUsers.validationSchema = null;

async function getUserById(req: Request<EntityId>, res: Response<GetUserByIdResponse>, next: NextFunction) {
  try {
    const user = await userService.getUserById(req.params.id, req.userId);
    res.send(user);
  } catch (error) {
    next(error);
  }
}
getUserById.validationSchema = { 
  params: { 
    id: Joi.alternatives().try(objectIdValidation, Joi.string().valid("me")), 
  }, 
};

async function updateUserById(
  req: Request<EntityId, {}, UserUpdateInput>, res: Response, next: NextFunction,
) {
  try {
    const updatedUser = await userService.updateUserById(req.params.id, req.body);
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
}
updateUserById.validationSchema = { 
  params: { id: Joi.alternatives().try(objectIdValidation, Joi.string().valid("me")) }, 
  body: { 
    isVerified: Joi.boolean().optional(), 
    username: Joi.string().optional(), 
    status: Joi.string().valid(AccountStatus.ACTIVE, AccountStatus.INACTIVE, AccountStatus.BANNED).optional(),
  },
};

async function getUserProfile(req: Request<EntityId>, res: Response, next: NextFunction) {
  try {
    const userProfile = await userService.getUserProfile(req.params.id, req.userId);
    res.send(userProfile);
  } catch (error) {
    next(error);
  }
}
getUserProfile.validationSchema = { 
  params: { id: Joi.alternatives().try(objectIdValidation, Joi.string().valid("me")) }, 
};

async function updateUserProfile(req: Request<EntityId, {}, any>, res: Response, next: NextFunction) {
  try {
    const updatedProfile = await userService.updateUserProfile(req.params.id, req.body, req.userId);
    res.send(updatedProfile);
  } catch (error) {
    next(error);
  }
}
updateUserProfile.validationSchema = { 
  params: { id: Joi.alternatives().try(objectIdValidation, Joi.string().valid("me")) }, 
  body: Joi.optional(),
};

async function linkRoleToUser(req: Request<{userId: string, roleId: string}>, res: Response, next: NextFunction) {
  try {
    await userService.linkRoleToUser(req.params.userId, req.params.roleId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
linkRoleToUser.validationSchema = {
  params: { userId: Joi.alternatives().try(objectIdValidation, Joi.string().valid("me")), roleId: objectIdValidation },
};

async function unlinkRoleFromUser(req: Request<{userId: string, roleId: string}>, res: Response, next: NextFunction) {
  try {
    await userService.unlinkRoleFromUser(req.params.userId, req.params.roleId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
unlinkRoleFromUser.validationSchema = {
  params: { userId: Joi.alternatives().try(objectIdValidation, Joi.string().valid("me")), roleId: objectIdValidation },
};

export function installUserRoutes(parentRouter: Router) {
  const router = Router();
  
  router.post("/", validate(createUser.validationSchema), authDelay, createUser);
  router.get(
    "/",
    requireAuthentication,
    collectDeviceInfo,
    requirePermission("userservice:list:any:user"),
    validate(getAllUsers.validationSchema), 
    getAllUsers,
  );
  
  router.get(
    "/:id",
    requireAuthentication,
    collectDeviceInfo,
    validate(getUserById.validationSchema), 
    getUserById,
  );
  
  router.patch(
    "/:id",
    requireAuthentication,
    collectDeviceInfo,
    requirePermission("userservice:update:any:user"),
    collectDeviceInfo,
    validate(updateUserById.validationSchema),
    updateUserById,
  );

  router.get(
    "/:id/profile",
    requireAuthentication,
    collectDeviceInfo,
    validate(getUserProfile.validationSchema), 
    getUserProfile,
  );
  
  router.patch(
    "/:id/profile",
    requireAuthentication,
    collectDeviceInfo,
    validate(updateUserProfile.validationSchema), 
    updateUserProfile,
  );

  router.post("/verify-email", validate(verifyEmail.validationSchema), verifyEmail);
  router.post("/reset-password", validate(resetPassword.validationSchema), authDelay, resetPassword);

  router.post(
    "/:userId/roles/:roleId",
    requireAuthentication,
    collectDeviceInfo,
    requirePermission("userservice:assign:any:role"),
    validate(linkRoleToUser.validationSchema),
    linkRoleToUser,
  );
  
  router.delete(
    "/:userId/roles/:roleId",
    requireAuthentication,
    collectDeviceInfo,
    requirePermission("userservice:remove:any:role"),
    validate(unlinkRoleFromUser.validationSchema),
    unlinkRoleFromUser,
  );

  parentRouter.use("/users", router);
};