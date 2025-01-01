import { Token } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import Joi from "joi";
import { authDelay, requireAuthentication } from "../core/auth";
import validate, { objectIdValidation } from "../core/validation";
import * as tokenService from "../service/token.service";
import * as userService from "../service/user.service";
import { EntityId, ListResponse } from "../types/common.types";
import { CreateTokenInput, TokenWithStatus } from "../types/token.types";
import { UserLoginInput } from "../types/user.types";

// handles creation of verification and password reset tokens
// TODO: send email with token -> Notification service
export async function createToken(req: Request<{}, {}, CreateTokenInput>, res: Response<Token>, next: NextFunction) {
  try {
    const token = await tokenService.createToken(req.userId, { ...req.body });
    res.status(201).send(token);
  } catch (error) {
    next(error);
  }
}
createToken.validationSchema = {
  body: {
    appId: objectIdValidation,
    deviceId: Joi.string().optional(),
    type: Joi.string().valid("verification", "password_reset"),
  },
};

export async function login(req: Request<{}, {}, UserLoginInput>, res: Response<string>, next: NextFunction) {
  try {
    const sessionToken = await userService.login(req.body);
    res.status(201).send(sessionToken);
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

export async function getAllTokens(req: Request, res: Response<ListResponse<Token>>, next: NextFunction) {
  try {
    const tokens = await tokenService.getAllTokens(req.userId);
    res.send({ items: tokens });
  } catch (error) {
    next(error);
  }
}
getAllTokens.validationSchema = null;
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

export async function deleteToken(req: Request<EntityId>, res: Response, next: NextFunction) {
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

export function installTokenRoutes(parentRouter: Router) {
  const router = Router();

  // TODO: check if user is verified
  router.post("/sessions", validate(login.validationSchema), authDelay, login);
  router.post("/", requireAuthentication, validate(createToken.validationSchema), createToken);
  router.get("/", requireAuthentication, validate(getAllTokens.validationSchema), getAllTokens);
  router.get("/:id", requireAuthentication, validate(getTokenById.validationSchema), getTokenById);
  router.delete("/:id",  requireAuthentication, validate(deleteToken.validationSchema), deleteToken);

  parentRouter.use("/tokens", router);
};