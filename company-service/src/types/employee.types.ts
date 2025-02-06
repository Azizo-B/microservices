import { DateFilterParams, PaginationParams, SortingParams } from "./common.types";

export interface CreateEmployeeInput {
  companyId: string;
  email: string;
  role: string;
  status: string;
}

export interface UpdateEmployeeInput {
  role?: string;
  status?: string;
}

export type EmployeeFilters = {
  companyId?: string;
  role?: string;
  email?: string;
} & PaginationParams &
  SortingParams &
  DateFilterParams;
