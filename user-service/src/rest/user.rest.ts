import { User } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import Joi from "joi";
import { authDelay, requireAuthentication, requirePermission } from "../core/auth";
import { collectDeviceInfo } from "../core/collectDeviceInfo";
import validate, { objectIdValidation } from "../core/validation";
import { createDevice } from "../service/device.service";
import * as userService from "../service/user.service";
import { EntityId, ListResponse } from "../types/common.types";
import { GetUserByIdResponse, UserSignupInput } from "../types/user.types";

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
createUser.validationScheme = { body: { email: Joi.string().email().lowercase() } };

async function verifyEmail(req: Request<{}, {}, {token:string}>, res: Response, next: NextFunction) {
  try {
    const token = await userService.verifyEmail(req.body.token);
    req.userId = token.userId;
    await createDevice(req);
    res.send();
  } catch (error) {
    next(error);
  }
}
verifyEmail.validationScheme = { body: { token: Joi.string() } };

async function getAllUsers(_: Request, res: Response<ListResponse<User>>, next: NextFunction) {
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

async function updateUserById(req: Request<EntityId, {}, { isVerified: boolean }>, res: Response, next: NextFunction) {
  try {
    const updatedUser = await userService.updateUserById(req.params.id, req.body.isVerified);
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
}
updateUserById.validationSchema = { 
  params: { id: objectIdValidation }, 
  body: { isVerified: Joi.boolean().required() },
};

async function getUserProfile(req: Request<EntityId>, res: Response, next: NextFunction) {
  try {
    const userProfile = await userService.getUserProfile(req.params.id, req.userId);
    res.send(userProfile);
  } catch (error) {
    next(error);
  }
}
getUserProfile.validationSchema = { params: { id: objectIdValidation } };

async function updateUserProfile(req: Request<EntityId, {}, any>, res: Response, next: NextFunction) {
  try {
    const updatedProfile = await userService.updateUserProfile(req.params.id, req.body, req.userId);
    res.send(updatedProfile);
  } catch (error) {
    next(error);
  }
}
updateUserProfile.validationSchema = { 
  params: { id: objectIdValidation }, 
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
linkRoleToUser.validationScheme = {
  params: { userId: objectIdValidation, roleId: objectIdValidation },
};

async function unlinkRoleFromUser(req: Request<{userId: string, roleId: string}>, res: Response, next: NextFunction) {
  try {
    await userService.unlinkRoleFromUser(req.params.userId, req.params.roleId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
unlinkRoleFromUser.validationScheme = {
  params: { userId: objectIdValidation , roleId: objectIdValidation },
};

export function installUserRoutes(parentRouter: Router) {
  const router = Router();
  
  router.post("/", validate(createUser.validationScheme), authDelay, createUser);
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

  router.post("/verify-email", validate(verifyEmail.validationScheme), verifyEmail);

  router.post(
    "/:userId/roles/:roleId",
    requireAuthentication,
    collectDeviceInfo,
    requirePermission("userservice:assign:any:role"),
    validate(linkRoleToUser.validationScheme),
    linkRoleToUser,
  );
  
  router.delete(
    "/:userId/roles/:roleId",
    requireAuthentication,
    collectDeviceInfo,
    requirePermission("userservice:remove:any:role"),
    validate(unlinkRoleFromUser.validationScheme),
    unlinkRoleFromUser,
  );

  parentRouter.use("/users", router);
};