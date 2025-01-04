import { Role } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import Joi from "joi";
import { requireAuthentication, requirePermission } from "../core/auth";
import { collectDeviceInfo } from "../core/collectDeviceInfo";
import validate, { objectIdValidation } from "../core/validation";
import * as roleService from "../service/role.service";
import { EntityId, ListResponse } from "../types/common.types";
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
createRole.validationScheme = {body: {name: Joi.string().required(), description: Joi.string().optional()}};

async function getAllRoles(_: Request, res: Response<ListResponse<Role>>, next: NextFunction) {
  try{
    const roles = await roleService.getAllRoles();
    res.send({items: roles});
  } catch(error){
    next(error);
  }
}
getAllRoles.validationScheme = null;

async function getRoleById(req: Request<EntityId>, res: Response<Role>, next: NextFunction) {
  try{
    const role = await roleService.getRoleById(req.params.id);
    res.send(role);
  } catch(error){
    next(error);
  }
}
getRoleById.validationScheme = {params: {id: objectIdValidation}};

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
updateRole.validationScheme = {params: {id: objectIdValidation}, body: {name: Joi.string(), description: Joi.string()}};

async function deleteRole(req: Request<EntityId>, res: Response<void>, next: NextFunction) {
  try{
    await roleService.deleteRole(req.params.id);
    res.status(204).send();
  } catch(error){
    next(error);
  }
}
deleteRole.validationScheme = {params: {id: objectIdValidation}};

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
assignPermissionToRole.validationScheme = { 
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
removePermissionFromRole.validationScheme = { 
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
    validate(createRole.validationScheme), 
    createRole,
  );
  router.get("/", validate(getAllRoles.validationScheme), getAllRoles);
  router.get("/:id", validate(getRoleById.validationScheme), getRoleById);
  router.patch(
    "/:id", 
    requireAuthentication,
    collectDeviceInfo, 
    requirePermission("userservice:update:any:role"), 
    validate(updateRole.validationScheme), 
    updateRole,
  );
  router.delete(
    "/:id", 
    requireAuthentication, 
    collectDeviceInfo,
    requirePermission("userservice:delete:any:role"), 
    validate(deleteRole.validationScheme), 
    deleteRole,
  );

  router.post(
    "/:roleId/permissions/:permissionId", 
    requireAuthentication, 
    collectDeviceInfo,
    requirePermission("userservice:assign:any:permission"), 
    validate(assignPermissionToRole.validationScheme), 
    assignPermissionToRole);
  router.delete(
    "/:roleId/permissions/:permissionId", 
    requireAuthentication, 
    collectDeviceInfo,
    requirePermission("userservice:remove:any:permission"), 
    validate(removePermissionFromRole.validationScheme), 
    removePermissionFromRole);

  parentRouter.use("/roles", router);
};
