import { Permission } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import Joi from "joi";
import { requireAuthentication, requirePermission } from "../core/auth";
import validate, { objectIdValidation } from "../core/validation";
import * as permissionService from "../service/permission.service";
import { EntityId, ListResponse } from "../types/common.types";
import {
  CreatePermissionInput,
  UpdatePermissionInput,
} from "../types/permission.types";

async function createPermission(
  req: Request<{}, {}, CreatePermissionInput>, res: Response<Permission>, next: NextFunction,
) {
  try{
    const permission = await permissionService.createPermission(req.body);
    res.status(201).send(permission);
  } catch(error){
    next(error);
  }
}
createPermission.validationScheme = {body: {name: Joi.string().required(), description: Joi.string().optional()}};

async function getAllPermissions(_: Request, res: Response<ListResponse<Permission>>, next: NextFunction) {
  try{
    const permissions = await permissionService.getAllPermissions();
    res.send({items: permissions});
  } catch(error){
    next(error);
  }
}
getAllPermissions.validationScheme = null;

async function getPermissionById(req: Request<EntityId>, res: Response<Permission>, next: NextFunction) {
  try{
    const permission = await permissionService.getPermissionById(req.params.id);
    res.send(permission);
  } catch(error){
    next(error);
  }
}
getPermissionById.validationScheme = {params: {id: objectIdValidation}};

async function updatePermission(
  req: Request<EntityId, {}, UpdatePermissionInput>, res: Response<Permission>, next: NextFunction,
) {
  try{
    const permission = await permissionService.updatePermission(req.params.id, req.body);
    res.send(permission);
  } catch(error){
    next(error);
  }
}
updatePermission.validationScheme = {
  params: {id: objectIdValidation}, 
  body: {name: Joi.string(), description: Joi.string()},
};

async function deletePermission(req: Request<EntityId>, res: Response<void>, next: NextFunction) {
  try{
    await permissionService.deletePermission(req.params.id);
    res.status(204).send();
  } catch(error){
    next(error);
  }
}
deletePermission.validationScheme = {params: {id: objectIdValidation}};

export function installPermissionRoutes(parentRouter: Router) {
  const router = Router();

  router.post(
    "/", 
    requireAuthentication, 
    requirePermission("userservice:create:any:permission"), 
    validate(createPermission.validationScheme), 
    createPermission,
  );
  router.get("/", validate(getAllPermissions.validationScheme), getAllPermissions);
  router.get("/:id", validate(getPermissionById.validationScheme), getPermissionById);
  router.patch(
    "/:id", 
    requireAuthentication, 
    requirePermission("userservice:update:any:permission"), 
    validate(updatePermission.validationScheme), 
    updatePermission,
  );
  router.delete(
    "/:id", 
    requireAuthentication, 
    requirePermission("userservice:delete:any:permission"), 
    validate(deletePermission.validationScheme), 
    deletePermission,
  );

  parentRouter.use("/permissions", router);
};
