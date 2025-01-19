import { Token } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import Joi from "joi";
import { authDelay, requireAuthentication } from "../core/auth";
import { collectDeviceInfo } from "../core/collectDeviceInfo";
import validate, { objectIdValidation, paginationParamsValidation } from "../core/validation";
import { createDevice } from "../service/device.service";
import * as tokenService from "../service/token.service";
import * as userService from "../service/user.service";
import { EntityId, ListResponse } from "../types/common.types";
import { CreateTokenInput, TokenFiltersWithPagination, TokenType, TokenWithStatus } from "../types/token.types";
import { UserLoginInput } from "../types/user.types";

export async function createToken(req: Request<{}, {}, CreateTokenInput>, res: Response, next: NextFunction) {
  try {
    await tokenService.createToken(req.body);
    res.status(201).send();
  } catch (error) {
    next(error);
  }
}
createToken.validationSchema = {
  body: {
    appId: objectIdValidation,
    userId: objectIdValidation,
    type: Joi.string().valid(TokenType.EMAIL_VERIFICATION, TokenType.PASSWORD_RESET),
  },
};

export async function login(req: Request<{}, {}, UserLoginInput>, res: Response<Token>, next: NextFunction) {
  try {
    const token = await userService.login(req.body);
    req.userId = token.userId;
    const deviceId = await createDevice(req);
    await tokenService.linkTokenToDevice(token.id, deviceId);
    res.send(token);
  } catch (error) {
    next(error);
  }
}
login.validationSchema = {
  body: {
    appId: objectIdValidation,
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

export async function getAllTokens(
  req: Request<{}, {}, {}, TokenFiltersWithPagination>, res: Response<ListResponse<Token>>, next: NextFunction,
) {
  try {
    const tokens = await tokenService.getAllTokens(req.userId, req.query);
    res.send({ items: tokens });
  } catch (error) {
    next(error);
  }
}
getAllTokens.validationSchema =  {
  query: {
    appId: objectIdValidation.optional(),
    deviceId: objectIdValidation.optional(),
    type: Joi.string().valid(TokenType.EMAIL_VERIFICATION, TokenType.PASSWORD_RESET).optional(),
    ...paginationParamsValidation,
  },
};;

export async function getTokenById(req: Request<EntityId>, res: Response<TokenWithStatus>, next: NextFunction) {
  try {
    const token = await tokenService.getTokenById(req.userId, req.params.id);
    res.send(token);
  } catch (error) {
    next(error);
  }
}
getTokenById.validationSchema = {
  params: {
    id: objectIdValidation,
  },
};

export async function deleteToken(req: Request<EntityId>, res: Response<void>, next: NextFunction) {
  try {
    await tokenService.deleteToken(req.userId, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
deleteToken.validationSchema = {
  params: {
    id: objectIdValidation,
  },
};

export async function introspectToken(
  req: Request<{}, {}, {}, {token: string}>, res: Response<void>, next: NextFunction,
) {
  try {
    await tokenService.checkToken(req.query.token);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
introspectToken.validationSchema = { query: { token: Joi.string() } };

export function installTokenRoutes(parentRouter: Router) {
  const router = Router();

  router.get("/introspect", validate(introspectToken.validationSchema), introspectToken);
  router.post("/sessions", validate(login.validationSchema), authDelay, login);
  router.post("/",  validate(createToken.validationSchema), createToken);
  router.get("/", requireAuthentication, collectDeviceInfo, validate(getAllTokens.validationSchema), getAllTokens);
  router.get("/:id", requireAuthentication, collectDeviceInfo, validate(getTokenById.validationSchema), getTokenById);
  router.delete("/:id",  requireAuthentication, collectDeviceInfo, validate(deleteToken.validationSchema), deleteToken);

  parentRouter.use("/tokens", router);
};