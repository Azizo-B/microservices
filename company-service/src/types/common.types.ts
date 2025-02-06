export type EntityId = {
  id: string
};

export interface ListResponse<T> {
  items: T[];
}

export interface PaginationParams {
  page?: number;  // default: 1
  limit?: number; // default: 10
};

export interface DateFilterParams {
  startDate?: string;
  endDate?: string;
};

export interface SortingParams {
  sortBy?: string;
  sortOrder?: string;
};
