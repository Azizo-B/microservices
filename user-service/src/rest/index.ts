import type { Application } from "express";
import { Router } from "express";
import { installApplicationRoutes } from "./application.rest";
import { installDeviceRoutes } from "./device.rest";
import { installPermissionRoutes } from "./permision.rest";
import { installRoleRoutes } from "./role.rest";
import { installTokenRoutes } from "./token.rest";
import { installUserRoutes } from "./user.rest";

export default function installRest(app: Application) {
  const router = Router();

  installDeviceRoutes(router);
  installApplicationRoutes(router);
  installPermissionRoutes(router);
  installRoleRoutes(router);
  installTokenRoutes(router);
  installUserRoutes(router);
  
  app.use("/api", router);
}
