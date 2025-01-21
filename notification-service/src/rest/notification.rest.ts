import { Notification } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import Joi from "joi";
import { requireAuthentication } from "../core/auth";
import validate, { objectIdValidation, paginationParamsValidation } from "../core/validation";
import * as notificationService from "../service/notification.service";
import { EntityId, ListResponse, PaginationParams } from "../types/common.types";
import { CreateNotificationInput, NotificationType } from "../types/notification.types";

async function createNotification(
  req: Request<{}, {}, CreateNotificationInput>,
  res: Response<Notification>,
  next: NextFunction,
) {
  try {
    const notification = await notificationService.createNotification(req.userId, req.body);
    res.status(201).send(notification);
  } catch (error) {
    next(error);
  }
}

createNotification.validationSchema = {
  body: Joi.object({
    type: Joi.string().valid(...Object.values(NotificationType)).required(),
    subject: Joi.string().optional(),
    body: Joi.string().required(),
    recipient: Joi.string().email().required(),
    senderId: Joi.string().required(),
  }),
};

async function getAllNotifications(
  req: Request<{}, {}, {}, PaginationParams>,
  res: Response<ListResponse<Notification>>,
  next: NextFunction,
) {
  try {
    const notifications = await notificationService.getAllNotifications(req.userId, req.query);
    res.send({ items: notifications });
  } catch (error) {
    next(error);
  }
}

getAllNotifications.validationSchema = {
  query: paginationParamsValidation,
};

async function getNotificationById(
  req: Request<EntityId>,
  res: Response<Notification>,
  next: NextFunction,
) {
  try {
    const notification = await notificationService.getNotificationById(req.userId, req.params.id);
    res.send(notification);
  } catch (error) {
    next(error);
  }
}

getNotificationById.validationSchema = {
  params: { id: objectIdValidation },
};

async function deleteNotification(
  req: Request<EntityId>,
  res: Response<void>,
  next: NextFunction,
) {
  try {
    await notificationService.deleteNotification(req.userId, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

deleteNotification.validationSchema = {
  params: { id: objectIdValidation },
};

export function installNotificationRoutes(parentRouter: Router) {
  const router = Router();

  router.post("/", requireAuthentication, validate(createNotification.validationSchema), createNotification);
  router.get("/", requireAuthentication, validate(getAllNotifications.validationSchema), getAllNotifications);
  router.get("/:id", requireAuthentication, validate(getNotificationById.validationSchema), getNotificationById);
  router.delete("/:id", requireAuthentication, validate(deleteNotification.validationSchema), deleteNotification);

  parentRouter.use("/notifications", router);
}
