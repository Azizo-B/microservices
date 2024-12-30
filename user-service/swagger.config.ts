import config from "config";
const PORT = config.get<number>("port");

export default {
  failOnErrors: true,
  apis: ["./src/docs/*.ts"],
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Service API",
      version: "1.0.0",
      description: "User service API documentation",
    },
    servers: [{ url: `http://localhost:${PORT}/` }],
  },
};
