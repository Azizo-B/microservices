import type { Application } from "express";
import { Router } from "express";
import { installApplicationRoutes } from "./application.rest";
import { installTokenRoutes } from "./token.rest";
import { installUserRoutes } from "./user.rest";

export default function installRest(app: Application) {
  const router = Router();

  installUserRoutes(router);
  installTokenRoutes(router);
  installApplicationRoutes(router);
  
  app.use("/api", router);
}
