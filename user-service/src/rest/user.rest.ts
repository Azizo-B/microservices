import { User } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import Joi from "joi";
import { authDelay, requireAuthentication, requirePermission } from "../core/auth";
import validate from "../core/validation";
import * as userService from "../service/user.service";
import { ListResponse } from "../types/common.types";
import { UserSigninInput } from "../types/user.types";
async function getAllUsers(_: Request, res: Response<ListResponse<User>>, next: NextFunction) {
  try {
    const users = await userService.getAllUsers();
    res.send({items: users});
  } catch (error) {
    next(error);
  }
}
getAllUsers.validationSchema = null;

async function createUser(req: Request<{}, {}, UserSigninInput>, res: Response, next: NextFunction) {
  try {
    const user = await userService.createUser(req.body);
    res.send(user);
  } catch (error) {
    next(error);
  }
}
createUser.validationScheme = { body: { email: Joi.string().email().lowercase() } };

export function installUserRoutes(parentRouter: Router) {
  const router = Router();

  router.get(
    "/",
    requireAuthentication,
    requirePermission("userservice:list:any:user"),
    validate(getAllUsers.validationSchema), 
    getAllUsers,
  );
  router.post("/", validate(createUser.validationScheme), authDelay, createUser);

  parentRouter.use("/users", router);
};