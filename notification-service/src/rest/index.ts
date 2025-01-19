import type { Application } from "express";
import { Router } from "express";
import { installSenderRoutes } from "./sender.rest";

export default function installRest(app: Application) {
  const router = Router();

  installSenderRoutes(router);

  app.use("/api", router);
}
