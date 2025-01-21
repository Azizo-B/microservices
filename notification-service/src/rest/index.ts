import type { Application } from "express";
import { Router } from "express";
import { installNotificationRoutes } from "./notification.rest";
import { installSenderRoutes } from "./sender.rest";

export default function installRest(app: Application) {
  const router = Router();

  installSenderRoutes(router);
  installNotificationRoutes(router);

  app.use("/api", router);
}
