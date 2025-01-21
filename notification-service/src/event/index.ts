import config from "config";
import { consumeEvent } from "../core/kafka";
import { handleUserCreatedEvent } from "./user.event";

const ENV = config.get<string>("env");

export const installEvents = async () => {

  await consumeEvent(`${ENV}.user-service.user.created`, handleUserCreatedEvent);

};
  