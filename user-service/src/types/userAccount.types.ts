export interface UpdateUserAccountInput {
  username: string;
  status: string;
}

export enum AccountStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BANNED = "banned",
}