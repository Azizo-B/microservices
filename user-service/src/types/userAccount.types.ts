import { EntityId, ListResponse } from "./common.types";

export interface UserAccount extends EntityId {
  id: string;
  username: string;
  status: string;
  userId: string;
  appId: string;
  createdAt: Date;

}

export interface CreateUserAccountInput {
  username: string;
  password: string;
  status: string;
  userId: string;
  appId: string
}

export interface UpdateUserAccountInput {
  username: string;
  status: string;
}

export interface GetAllUserAccountsResponse extends ListResponse<UserAccount>{}
