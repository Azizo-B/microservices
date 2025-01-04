import config from "config";
import express, { Application } from "express";
import { getLogger } from "./core/logging";

import { installErrorHandlers, installMiddlewares } from "./core/installMiddleware";
import { initializeData, shutdownData } from "./data";
import installRest from "./rest";

const PORT = config.get<number>("port");

export interface Server {
  getApp(): Application;
  start(): Promise<void>;
  stop(): Promise<void>;
}

async function createServer(): Promise<Server> {
  const app = express();

  installMiddlewares(app);
  await initializeData();
  installRest(app);
  installErrorHandlers(app);

  return {
    getApp() {
      return app;
    },

    start() {
      return new Promise<void>((resolve) => {
        app.listen(PORT, () => {
          getLogger().info(`Express listening on http://localhost:${PORT}`);
          resolve();
        });
      });
    },

    async stop() {
      await shutdownData();
      getLogger().info("Goodbye! 👋");
    },
  };
}

async function main() {
  try {
    const server = await createServer();
    await server.start();

    async function onClose() {
      await server.stop();
      process.exit(0);
    }

    process.on("SIGTERM", onClose);
    process.on("SIGQUIT", onClose);
  } catch (error) {
    console.log("\n", error);
    process.exit(-1);
  }
}

main();

// TODO: useraccount creation /useraccount not /users
// TODO: useraccount deletion deletes account
// TODO: what happens in other services when an user account gets deleted?
// TODO: send mail upon account creation
// TODO: finetune prisma schema by adding unique idx
// TODO: write tests 
