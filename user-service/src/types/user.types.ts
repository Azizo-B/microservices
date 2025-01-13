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
  devices: BasicDeviceInfo[];
}

export enum AccountStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BANNED = "banned",
}
export interface UserUpdateInput {
  isVerified: boolean
  status: AccountStatus
}

export interface PublicUser{
  id: string;
  appId: string;
  username: string;
  email: string;
  profile: JsonValue;
  status: string;
  isVerified: boolean;
  createdAt: Date;
}