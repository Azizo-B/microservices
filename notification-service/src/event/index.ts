import { consumeEvent } from "../core/kafka";
import { handleUserCreatedEvent } from "./user.event";

export const installEvents = async () => {

  await consumeEvent("userservice.user.created", handleUserCreatedEvent);

};
  