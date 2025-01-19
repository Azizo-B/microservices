import { Sender } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import Joi from "joi";
import { requireAuthentication } from "../core/auth";
import validate, { objectIdValidation, paginationParamsValidation } from "../core/validation";
import * as senderService from "../service/sender.service";
import { EntityId, ListResponse, PaginationParams } from "../types/common.types";
import { CreateSenderInput, UpdateSenderInput } from "../types/sender.types";

async function createSender(req: Request<{}, {}, CreateSenderInput>, res: Response<Sender>, next: NextFunction) {
  try {
    const sender = await senderService.createSender(req.userId, req.body);
    res.status(201).send(sender);
  } catch (error) {
    next(error);
  }
}

const emailSenderSchema = Joi.object({
  name: Joi.string(),
  type: Joi.string().valid("email"),
  credentails: Joi.object({
    smtpHost: Joi.string(),
    smtpPort: Joi.number(),
    username: Joi.string(),
    password: Joi.string(),
  }),
});

createSender.validationSchema = { body: { emailSenderSchema } };

async function getAllSenders(
  req: Request<{}, {}, {}, PaginationParams>,
  res: Response<ListResponse<Sender>>,
  next: NextFunction
) {
  try {
    const senders = await senderService.getAllSenders(req.userId, req.query);
    res.send({ items: senders });
  } catch (error) {
    next(error);
  }
}
getAllSenders.validationSchema = {
  query: {
    ...paginationParamsValidation,
  },
};

// TODO: do not return credentials
async function getSenderById(req: Request<EntityId>, res: Response<Sender>, next: NextFunction) {
  try {
    const sender = await senderService.getSenderById(req.userId, req.params.id);
    res.send(sender);
  } catch (error) {
    next(error);
  }
}
getSenderById.validationSchema = {
  params: { id: objectIdValidation },
};

async function updateSender(req: Request<EntityId, {}, UpdateSenderInput>, res: Response<Sender>, next: NextFunction) {
  try {
    const sender = await senderService.updateSender(req.userId, req.params.id, req.body);
    res.send(sender);
  } catch (error) {
    next(error);
  }
}

updateSender.validationSchema = {
  params: { id: objectIdValidation },
  body: { emailSenderSchema },
};

async function deleteSender(req: Request<EntityId>, res: Response<void>, next: NextFunction) {
  try {
    await senderService.deleteSender(req.userId, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
deleteSender.validationSchema = { params: { id: objectIdValidation } };

export function installSenderRoutes(parentRouter: Router) {
  const router = Router();

  router.post("/", requireAuthentication, validate(createSender.validationSchema), createSender);
  router.get("/", requireAuthentication, validate(getAllSenders.validationSchema), getAllSenders);
  router.get("/:id", requireAuthentication, validate(getSenderById.validationSchema), getSenderById);
  router.put("/:id", requireAuthentication, validate(updateSender.validationSchema), updateSender);
  router.delete("/:id", requireAuthentication, validate(deleteSender.validationSchema), deleteSender);

  parentRouter.use("/senders", router);
}
