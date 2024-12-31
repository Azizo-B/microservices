import type { Application } from "express";
import { Router } from "express";
import installUserRoutes from "./user.rest";

export default function installRest(app: Application) {
  const router = Router();

  installUserRoutes(router);
  
  app.use("/api", router);
}
