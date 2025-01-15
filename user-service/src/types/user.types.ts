import { JsonValue } from "@prisma/client/runtime/library";
import { PaginationParams } from "./common.types";
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
  username: string,
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

export type UserRoleParams = {
  userId: string;
  roleId: string;
};

export interface VerifyEmailBody {
  token: string;
}

export interface ResetPasswordBody {
  token: string;
  newPassword: string;
}

export interface UserFiltersWithPagination extends PaginationParams {
  appId?: string
  username?: string
  email?: string
  status?: AccountStatus
  isVerified?: boolean
}