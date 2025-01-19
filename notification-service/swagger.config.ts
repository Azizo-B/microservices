import config from "config";
const PORT = config.get<string>("port");
const SERVER_URL = config.get<string>("server_url");
const NODE_ENV = config.get<string>("env");

const apis = ["./src/docs/*"];
if(NODE_ENV === "production"){
  apis.push("./dist/src/docs/*");
}
export default {
  failOnErrors: true,
  apis,
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notification Service API",
      version: "1.0.0",
      description: "Notification service API documentation",
    },
    servers: [{ url:  SERVER_URL }, { url:  `http://localhost:${PORT}` }],
  },
};
