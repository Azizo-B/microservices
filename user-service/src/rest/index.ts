import { Application, Router } from "express";

export default function installRest(app: Application) {
  const router = Router();

  app.use(router);
}
