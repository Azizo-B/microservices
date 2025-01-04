import { Token } from "@prisma/client";

export interface CreateTokenInput {
  appId: string;
  deviceId?: string;
  type: string;
};

export interface TokenWithStatus extends Token {
  isValid: boolean;
  detail: string | null;
}

