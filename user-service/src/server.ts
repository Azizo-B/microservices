import config from "config";
import express, { Application } from "express";
import { installErrorHandlers, installMiddlewares } from "./core/installMiddleware";
import { getLogger } from "./core/logging";
import installRest from "./rest";

const PORT = config.get<number>("port");

export interface Server {
  getApp(): Application;
  start(): Promise<void>;
}

export async function createServer(): Promise<Server> {
  const app = express();

  installMiddlewares(app);
  installRest(app);
  installErrorHandlers(app);

  return {
    getApp() {
      return app;
    },

    start() {
      return new Promise((resolve) => {
        app.listen(PORT, () => {
          getLogger().info(`Express listening on http://localhost:${PORT}`);
          resolve();
        });
      });
    },
  };
}

