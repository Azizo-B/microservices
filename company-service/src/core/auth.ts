import axios from "axios";
import config from "config";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ServiceError from "./serviceError";

const USER_SERVICE_BASE_URL = config.get<string>("userService.baseUrl");

export const requireAuthentication = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const authorization = req.headers["authorization"] || "";

    if (!authorization) {
      throw ServiceError.unauthorized("Authorization header is missing.");
    }

    const decodedToken = jwt.decode(authorization.replace("Bearer ", ""));

    if (!decodedToken || typeof decodedToken !== "object" || !decodedToken.sub) {
      throw ServiceError.unauthorized("Invalid token payload.");
    }

    await axios.get(`${USER_SERVICE_BASE_URL}/api/tokens/introspect?token=${authorization.replace("Bearer ", "")}`);

    req.userId = decodedToken.sub;
    next();
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "Authentication failed.";
      next(new ServiceError(status.toString(), message));
    } else {
      next(error);
    }
  }
};

export async function checkPermission(permission: string, userId: string): Promise<boolean> {
  if (!userId) {
    throw ServiceError.unauthorized("User is not authenticated.");
  }

  try {
    const response = await axios.get(`${USER_SERVICE_BASE_URL}/api/permissions?userId=${userId}&name=${permission}`);
    const { items } = response.data;

    return !items;
  } catch {
    return false;
  }
}

export const requirePermission = (permission: string) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      const hasPermission = await checkPermission(permission, req.userId);

      if (!hasPermission) {
        throw ServiceError.forbidden(`You do not have the required permissions. Required: ${permission}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
