import axios from "axios";
import config from "config";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getLogger } from "./logging";
import ServiceError from "./serviceError";

const USER_SERVICE_EMAIL = config.get<string>("userService.email");
const USER_SERVICE_PASSWORD = config.get<string>("userService.password");
const USER_SERVICE_BASE_URL = config.get<string>("userService.baseUrl");

let serviceAuthToken: string | null = null;
let serviceAuthTokenExpiration: number | null = null;

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

    await axios.get(
      `${USER_SERVICE_BASE_URL}/api/tokens/introspect?token=${authorization.replace("Bearer ", "")}`,
    );

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

  try{
    const response = await axios.get(`${USER_SERVICE_BASE_URL}/api/permissions?userId=${userId}&name=${permission}`);
    const { items } = response.data;

    return !items;
  }catch{
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

// TODO: remove the need for authtokens generate long lasting auth token for services

const requestAuthToken = async (): Promise<string> => {
  try {
    const response = await axios.post(`${USER_SERVICE_BASE_URL}/api/tokens/sessions`, {
      appId: "6776f66b36f367b1e0f02bd3",
      email: USER_SERVICE_EMAIL,
      password: USER_SERVICE_PASSWORD,
    });
    const { token, expiresAt } = response.data;
    serviceAuthTokenExpiration = serviceAuthTokenExpiration = new Date(expiresAt).getTime();
    serviceAuthToken = token;
    getLogger().info("Successfully logged in and obtained a new auth token");
    return token;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "Authentication failed.";
      throw new ServiceError(status.toString(), message);
    } else {
      throw error;
    }
  }
};

const introspectToken = async (token: string): Promise<boolean> => {
  try {
    await axios.get(`${USER_SERVICE_BASE_URL}/api/tokens/introspect?token=${token}`);
    return true;
  } catch {
    return false;
  }
};

export const getAuthToken = async (): Promise<string> => {
  if (!serviceAuthToken || (serviceAuthTokenExpiration && Date.now() > serviceAuthTokenExpiration)) {
    getLogger().info("Token expired or not found. Requesting new token...");
    return await requestAuthToken();
  }
  const isValid = await introspectToken(serviceAuthToken);

  if (isValid) {
    return serviceAuthToken;
  }
  return await requestAuthToken();
};
