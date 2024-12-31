import { EntityId, ListResponse } from "./common.types";

export interface Application extends EntityId {
  name: string;
}

export interface CreateApplicationInput {
  name: string;
}

export interface UpdateApplicationInput {
  name: string;
}

export interface GetAllApplicationsResponse extends ListResponse<Application>{}
