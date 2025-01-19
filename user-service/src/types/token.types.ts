import { Token } from "@prisma/client";
import { PaginationParams } from "./common.types";

export interface CreateTokenInput {
  appId: string;
  userId: string;
  deviceId?: string;
  type: string;
}

export interface TokenWithStatus extends Token {
  isValid: boolean;
  detail: string | null;
}

export enum TokenType {
  SESSION = "session",
  REFRESH = "refresh",
  PASSWORD_RESET = "password_reset",
  EMAIL_VERIFICATION = "email_verification",
}

export interface TokenIdentifiers {
  userId: string;
  jti: string;
}

export interface TokenFiltersWithPagination extends PaginationParams {
  appId?: string;
  deviceId?: string;
  type?: TokenType;
}
