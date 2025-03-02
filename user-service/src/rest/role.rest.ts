import { Role } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import Joi from "joi";
import { requireAuthentication, requirePermission } from "../core/auth";
import { collectDeviceInfo } from "../core/collectDeviceInfo";
import validate, { objectIdValidation, paginationParamsValidation } from "../core/validation";
import * as roleService from "../service/role.service";
import { EntityId, ListResponse, PaginationParams } from "../types/common.types";
import {
  CreateRoleInput,
  UpdateRoleInput,
} from "../types/role.types";

async function createRole(
  req: Request<{}, {}, CreateRoleInput>, res: Response<Role>, next: NextFunction,
) {
  try{
    const role = await roleService.createRole(req.body);
    res.status(201).send(role);
  } catch(error){
    next(error);
  }
}
createRole.validationSchema = {body: {name: Joi.string().required(), description: Joi.string().optional()}};

async function getAllRoles(
  req: Request<{}, {}, {}, PaginationParams>, res: Response<ListResponse<Role>>, next: NextFunction,
) {
  try{
    const roles = await roleService.getAllRoles(req.query);
    res.send({items: roles});
  } catch(error){
    next(error);
  }
}
getAllRoles.validationSchema = {query: paginationParamsValidation};

async function getRoleById(req: Request<EntityId>, res: Response<Role>, next: NextFunction) {
  try{
    const role = await roleService.getRoleById(req.params.id);
    res.send(role);
  } catch(error){
    next(error);
  }
}
getRoleById.validationSchema = {params: {id: objectIdValidation}};

async function updateRole(
  req: Request<EntityId, {}, UpdateRoleInput>, res: Response<Role>, next: NextFunction,
) {
  try{
    const role = await roleService.updateRole(req.params.id, req.body);
    res.send(role);
  } catch(error){
    next(error);
  }
}
updateRole.validationSchema = {
  params: {id: objectIdValidation}, 
  body: {name: Joi.string().optional(), description: Joi.string().optional()},
};

async function deleteRole(req: Request<EntityId>, res: Response<void>, next: NextFunction) {
  try{
    await roleService.deleteRole(req.params.id);
    res.status(204).send();
  } catch(error){
    next(error);
  }
}
deleteRole.validationSchema = {params: {id: objectIdValidation}};

async function assignPermissionToRole(
  req: Request<{ roleId: string; permissionId: string }>, 
  res: Response, 
  next: NextFunction,
) {
  try {
    const { roleId, permissionId } = req.params;
    await roleService.assignPermissionToRole(roleId, permissionId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
assignPermissionToRole.validationSchema = { 
  params: { roleId: objectIdValidation, permissionId: objectIdValidation }, 
};
  
async function removePermissionFromRole(
  req: Request<{ roleId: string; permissionId: string }>, 
  res: Response, 
  next: NextFunction,
) {
  try {
    const { roleId, permissionId } = req.params;
    await roleService.removePermissionFromRole(roleId, permissionId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
removePermissionFromRole.validationSchema = { 
  params: { roleId: objectIdValidation, permissionId: objectIdValidation }, 
};
  
// Install Role Routes
export function installRoleRoutes(parentRouter: Router) {
  const router = Router();

  router.post(
    "/", 
    requireAuthentication,
    collectDeviceInfo, 
    requirePermission("userservice:create:any:role"), 
    validate(createRole.validationSchema), 
    createRole,
  );
  router.get("/", validate(getAllRoles.validationSchema), getAllRoles);
  router.get("/:id", validate(getRoleById.validationSchema), getRoleById);
  router.patch(
    "/:id", 
    requireAuthentication,
    collectDeviceInfo, 
    requirePermission("userservice:update:any:role"), 
    validate(updateRole.validationSchema), 
    updateRole,
  );
  router.delete(
    "/:id", 
    requireAuthentication, 
    collectDeviceInfo,
    requirePermission("userservice:delete:any:role"), 
    validate(deleteRole.validationSchema), 
    deleteRole,
  );

  router.post(
    "/:roleId/permissions/:permissionId", 
    requireAuthentication, 
    collectDeviceInfo,
    requirePermission("userservice:assign:any:permission"), 
    validate(assignPermissionToRole.validationSchema), 
    assignPermissionToRole);
  router.delete(
    "/:roleId/permissions/:permissionId", 
    requireAuthentication, 
    collectDeviceInfo,
    requirePermission("userservice:remove:any:permission"), 
    validate(removePermissionFromRole.validationSchema), 
    removePermissionFromRole);

  parentRouter.use("/roles", router);
};
