import { Device } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { requireAuthentication } from "../core/auth";
import { collectDeviceInfo } from "../core/collectDeviceInfo";
import validate, { objectIdValidation, paginationParamsValidation } from "../core/validation";
import * as deviceService from "../service/device.service";
import { EntityId, ListResponse } from "../types/common.types";
import { DeviceAndIps, DeviceFiltersWithPagination } from "../types/device.types";

async function getAllDevices(
  req: Request<{}, {}, {}, DeviceFiltersWithPagination>, res: Response<ListResponse<Device>>, next: NextFunction,
) {
  try{
    const devices = await deviceService.getAllDevices(req.userId, req.query);
    res.send({items: devices});
  } catch(error){
    next(error);
  }

}
getAllDevices.validationSchema = {
  query: {
    userId: objectIdValidation.optional(),
    ...paginationParamsValidation,
  },
};

async function getDeviceById(req: Request<EntityId>, res: Response<DeviceAndIps>, next: NextFunction) {
  try{
    const device = await deviceService.getDeviceById(req.params.id, req.userId);
    res.send(device);
  } catch(error){
    next(error);
  }

}
getDeviceById.validationSchema = {params: {id: objectIdValidation}};

export function installDeviceRoutes(parentRouter: Router) {
  const router = Router();

  router.get("/", requireAuthentication,  collectDeviceInfo, validate(getAllDevices.validationSchema), getAllDevices);
  router.get("/:id", requireAuthentication, collectDeviceInfo, validate(getDeviceById.validationSchema), getDeviceById);

  parentRouter.use("/devices", router);
};