import { Application } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import Joi from "joi";
import { requireAuthentication, requirePermission } from "../core/auth";
import validate, { objectIdValidation } from "../core/validation";
import * as applicationService from "../service/application.service";
import {
  CreateApplicationInput,
  UpdateApplicationInput,
} from "../types/application.types";
import { EntityId, ListResponse } from "../types/common.types";

async function createApplication(
  req: Request<{}, {}, CreateApplicationInput>, res: Response<Application>, next: NextFunction,
) {
  try{
    const application = await applicationService.createApplication(req.body);
    res.status(201).send(application);
  }catch(error){
    next(error);
  }
}
createApplication.validationScheme = {body: {name: Joi.string()}};

async function getAllApplications(_: Request, res: Response<ListResponse<Application>>, next: NextFunction) {
  try{
    const applications = await applicationService.getAllApplications();
    res.send({items: applications});
  } catch(error){
    next(error);
  }

}
getAllApplications.validationScheme = null;

async function getApplicationById(req: Request<EntityId>, res: Response<Application | null>, next: NextFunction) {
  try{
    const application = await applicationService.getApplicationById(req.params.id);
    res.send(application);
  } catch(error){
    next(error);
  }

}
getApplicationById.validationScheme = {params: {id: objectIdValidation}};

async function updateApplication(
  req: Request<EntityId, {}, UpdateApplicationInput>, res: Response<Application>, next: NextFunction,
) {
  try{
    const application = await applicationService.updateApplication(req.params.id, req.body);
    res.send(application);
  } catch(error){
    next(error);
  }
}
updateApplication.validationScheme = {params: {id: objectIdValidation}, body: {name: Joi.string()}};

async function deleteApplication(req: Request<EntityId>, res: Response<void>, next: NextFunction) {
  try{
    await applicationService.deleteApplication(req.params.id);
    res.status(204).send();
  } catch(error){
    next(error);
  }
}
deleteApplication.validationScheme = {params: {id: objectIdValidation}};

export function installApplicationRoutes(parentRouter: Router) {
  const router = Router();

  router.post(
    "/", 
    requireAuthentication, 
    requirePermission("userservice:create:any:application"), 
    validate(createApplication.validationScheme), 
    createApplication,
  );
  router.get("/", validate(getAllApplications.validationScheme), getAllApplications);
  router.get("/:id", validate(getApplicationById.validationScheme), getApplicationById);
  router.put(
    "/:id", 
    requireAuthentication, 
    requirePermission("userservice:update:any:application"), 
    validate(updateApplication.validationScheme), 
    updateApplication,
  );
  router.delete(
    "/:id", 
    requireAuthentication, 
    requirePermission("userservice:delete:any:application"), 
    validate(deleteApplication.validationScheme), 
    deleteApplication,
  );

  parentRouter.use("/applications", router);
};