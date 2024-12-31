import config from "config";
import cors from "cors";
import type { Application, NextFunction, Request, Response } from "express";
import express from "express";
import helmet from "helmet";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "../../swagger.config";
import { getLogger } from "./logging";
import ServiceError from "./serviceError";

const NODE_ENV = config.get<string>("env");
const CORS_ORIGINS = config.get<string[]>("cors.origins");
const CORS_MAX_AGE = config.get<number>("cors.maxAge");

export default function installMiddlewares(app: Application) {
  app.use(
    cors({
      origin: (origin: any, callback: any) => {
        const allowedOrigin = origin && CORS_ORIGINS.includes(origin) ? origin : CORS_ORIGINS[0] || "";
        callback(null, allowedOrigin);
      },
      allowedHeaders: ["Accept", "Content-Type", "Authorization"],
      maxAge: CORS_MAX_AGE,
    }),
  );

  app.use(express.json());

  app.use(helmet({ contentSecurityPolicy: false })); // API DOCS IN PROD

  const spec = swaggerJsdoc(swaggerOptions) as Record<string, unknown>;

  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(spec));

  app.use((req: Request, res: Response, next: NextFunction) => {
    getLogger().info(`⏩ ${req.method} ${req.url}`);

    const getStatusEmoji = (status: number) => {
      if (status >= 500) return "💀";
      if (status >= 400) return "❌";
      if (status >= 300) return "🔀";
      if (status >= 200) return "✅";
      return "🔄";
    };

    res.on("finish", () => {
      getLogger().info(`${getStatusEmoji(res.statusCode)} ${req.method} ${res.statusCode} ${req.url}`);
    });

    next();
  });

  app.use((err: any, _: Request, res: Response, _next: NextFunction) => {
    getLogger().error("Error occurred while handling a request", { error: err });

    let statusCode = err.status || 500;
    const errorBody = {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: NODE_ENV !== "production" ? err.message : "Unexpected error occurred. Please try again later.",
      details: err.details,
      stack: NODE_ENV !== "production" ? err.stack : undefined,
    };

    if (err instanceof ServiceError) {
      errorBody.message = err.message;

      if (err.isNotFound) {
        statusCode = 404;
      }

      if (err.isValidationFailed) {
        statusCode = 400;
      }

      if (err.isUnauthorized) {
        statusCode = 401;
      }

      if (err.isForbidden) {
        statusCode = 403;
      }

      if (err.isConflict) {
        statusCode = 409;
      }
    }

    res.status(statusCode).json(errorBody);
  });
}
