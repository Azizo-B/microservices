import { NotificationType } from "./notification.types";

export type Credentials = {};

export type EmailCredentials = Credentials & {
  smtpHost: string;
  smtpPort: number;
  email: string;
  password: string;
};

export interface Sender {
  name: string;
  type: NotificationType;
  credentials: Credentials;
}

export interface CreateSenderInput extends Sender {}
export interface UpdateSenderInput extends Sender {}
