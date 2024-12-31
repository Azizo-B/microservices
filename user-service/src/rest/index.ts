import type { Application } from "express";
import { Router } from "express";
import { installApplicationRoutes } from "./application.rest";
import { installUserRoutes } from "./user.rest";

export default function installRest(app: Application) {
  const router = Router();

  installUserRoutes(router);
  installApplicationRoutes(router);
  
  app.use("/api", router);
}
