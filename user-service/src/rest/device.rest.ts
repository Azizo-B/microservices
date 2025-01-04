import { Device } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { requireAuthentication } from "../core/auth";
import { collectDeviceInfo } from "../core/collectDeviceInfo";
import validate, { objectIdValidation } from "../core/validation";
import * as deviceService from "../service/device.service";
import { EntityId, ListResponse } from "../types/common.types";
import { DeviceAndIps } from "../types/device.types";

async function getAllDevices(req: Request, res: Response<ListResponse<Device>>, next: NextFunction) {
  try{
    const devices = await deviceService.getAllDevices(req.userId);
    res.send({items: devices});
  } catch(error){
    next(error);
  }

}
getAllDevices.validationScheme = null;

async function getDeviceById(req: Request<EntityId>, res: Response<DeviceAndIps>, next: NextFunction) {
  try{
    const device = await deviceService.getDeviceById(req.params.id, req.userId);
    res.send(device);
  } catch(error){
    next(error);
  }

}
getDeviceById.validationScheme = {params: {id: objectIdValidation}};

export function installDeviceRoutes(parentRouter: Router) {
  const router = Router();

  router.get("/", requireAuthentication,  collectDeviceInfo, validate(getAllDevices.validationScheme), getAllDevices);
  router.get("/:id", requireAuthentication, collectDeviceInfo, validate(getDeviceById.validationScheme), getDeviceById);

  parentRouter.use("/devices", router);
};