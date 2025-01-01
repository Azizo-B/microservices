import { EntityId, ListResponse } from "./common.types";

export interface UserAccount extends EntityId {
  username: string;
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
  password: string;
  status: string;
}

export interface GetAllUserAccountsResponse extends ListResponse<UserAccount>{}
