import config from "config";
import type { NextFunction, Request, Response } from "express";
import * as userService from "../service/user.service";

const AUTH_MAX_DELAY = config.get<number>("auth.maxDelay");

export const requireAuthentication = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const authorization = req.headers["authorization"] || "";
    req.userId = await userService.checkAndParseToken(authorization);
    next();
  } catch (error) {
    next(error);
  }
};

export const requirePermission = (permission: string) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      await userService.checkPermission(permission, req.userId);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const authDelay = async (_: Request, __: Response, next: NextFunction) => {
  try {
    await new Promise((resolve) => {
      const delay = Math.round(Math.random() * AUTH_MAX_DELAY);
      setTimeout(resolve, delay);
    });
    next();
  } catch (error) {
    next(error);
  }
};