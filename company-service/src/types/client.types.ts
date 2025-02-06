import { DateFilterParams, PaginationParams, SortingParams } from "./common.types";

export interface CreateClientInput {
  companyId: string;
  name: string;
  type: string;
  contact: string;
}

export type ClientFilters = {
  companyId?: string;
  name?: string;
} & PaginationParams &
  SortingParams &
  DateFilterParams;

export interface UpdateClientInput {
  name?: string;
  contact?: string;
}
