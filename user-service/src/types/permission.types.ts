import { PaginationParams } from "./common.types";

export interface CreatePermissionInput {
  name: string;
  description?: string;
}
  
export interface UpdatePermissionInput {
  name: string;
  description?: string;
}

export interface PermissionFiltersWithPagination extends PaginationParams {
  userId?: string
  name?: string
}