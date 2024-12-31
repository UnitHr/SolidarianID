// paginated-response.dto.ts

export class PaginatedResponse<T> {
  data: T[];

  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}
