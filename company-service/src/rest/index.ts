import type { Application } from "express";
import { Router } from "express";
import { installClientRoutes } from "./client.rest";
import { installCompanyRoutes } from "./company.rest";
import { installEmployeeRoutes } from "./employee.rest";

export default function installRest(app: Application) {
  const router = Router();

  installCompanyRoutes(router);
  installEmployeeRoutes(router);
  installClientRoutes(router);

  app.use("/api", router);
}
