import type { Request, Response } from "express";
import { Router } from "express";
import Joi from "joi";
import validate from "../core/validation";
import * as userService from "../service/user.service";

async function getAllUsers(_: Request, res: Response) {
  const users = await userService.getAllUsers();
  res.send(users);
}

async function createUser(req: Request, res: Response) {
  const user = await userService.createUser(req.body.email);
  res.send(user);
}
createUser.validationScheme = {body: {email: Joi.string().email().lowercase()}};

export function installUserRoutes(parentRouter: Router) {
  const router = Router();

  router.get("/", getAllUsers);
  router.post("/", validate(createUser.validationScheme), createUser);

  parentRouter.use("/users", router);
};