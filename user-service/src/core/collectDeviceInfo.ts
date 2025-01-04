import { NextFunction, Request, Response } from "express";
import { createDevice } from "../service/device.service";

export const collectDeviceInfo = async (req: Request, _: Response, next: NextFunction) => {
  try {
    req.deviceId = await createDevice(req);
    next();
  } catch (error) {
    next(error);
  }
};
  
