import { NotificationType } from "../types/notification.types";
import { emailProcessor } from "./email.processor";

const processors: Record<NotificationType, any> = {
  "email": emailProcessor,
};

export default processors;

