import { UserAccount } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { BasicDeviceInfo } from "./device.types";

export interface UserLoginInput{
  appId: string;
  email: string;
  password: string;
}

export interface UserSignupInput{
  appId: string;
  username: string;
  email: string;
  password: string;
}

export interface GetUserByIdResponse {
  id: string;
  email: string;
  profile: JsonValue;
  roles: string[];
  permissions: string[];
  accounts: Omit<UserAccount, "userId">[];
  devices: BasicDeviceInfo[];
}