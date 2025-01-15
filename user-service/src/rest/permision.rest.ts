import { Permission } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import Joi from "joi";
import { requireAuthentication, requirePermission } from "../core/auth";
import validate, { objectIdValidation, paginationParamsValidation } from "../core/validation";
import * as permissionService from "../service/permission.service";
import { EntityId, ListResponse } from "../types/common.types";
import {
  CreatePermissionInput,
  PermissionFiltersWithPagination,
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
createPermission.validationSchema = {body: {name: Joi.string().required(), description: Joi.string().optional()}};

async function getAllPermissions(
  req: Request<{}, {}, {}, PermissionFiltersWithPagination>, 
  res: Response<ListResponse<Permission>>, 
  next: NextFunction,
) {
  try{
    const permissions = await permissionService.getAllPermissions(req.query);
    res.send({items: permissions});
  } catch(error){
    next(error);
  }
}
getAllPermissions.validationSchema = {
  query: {name: Joi.string().optional(), userId: objectIdValidation.optional(), ...paginationParamsValidation},
};

async function getPermissionById(req: Request<EntityId>, res: Response<Permission>, next: NextFunction) {
  try{
    const permission = await permissionService.getPermissionById(req.params.id);
    res.send(permission);
  } catch(error){
    next(error);
  }
}
getPermissionById.validationSchema = {params: {id: objectIdValidation}};

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
updatePermission.validationSchema = {
  params: {id: objectIdValidation}, 
  body: {name: Joi.string().optional(), description: Joi.string().optional()},
};

async function deletePermission(req: Request<EntityId>, res: Response<void>, next: NextFunction) {
  try{
    await permissionService.deletePermission(req.params.id);
    res.status(204).send();
  } catch(error){
    next(error);
  }
}
deletePermission.validationSchema = {params: {id: objectIdValidation}};

export function installPermissionRoutes(parentRouter: Router) {
  const router = Router();

  router.post(
    "/", 
    requireAuthentication, 
    requirePermission("userservice:create:any:permission"), 
    validate(createPermission.validationSchema), 
    createPermission,
  );
  router.get("/", validate(getAllPermissions.validationSchema), getAllPermissions);
  router.get("/:id", validate(getPermissionById.validationSchema), getPermissionById);
  router.patch(
    "/:id", 
    requireAuthentication, 
    requirePermission("userservice:update:any:permission"), 
    validate(updatePermission.validationSchema), 
    updatePermission,
  );
  router.delete(
    "/:id", 
    requireAuthentication, 
    requirePermission("userservice:delete:any:permission"), 
    validate(deletePermission.validationSchema), 
    deletePermission,
  );

  parentRouter.use("/permissions", router);
};
