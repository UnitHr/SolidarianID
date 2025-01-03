export class PaginatedResponse<T> {
  data: T[];

  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    nextPage?: string | null;
    prevPage?: string | null;
  };

  constructor(data: T[], total: number, page: number, size: number) {
    this.data = data;
    this.pagination = this.getPaginationData(total, page, size);
  }

  private getPaginationData(total: number, page: number, size: number) {
    const totalPages = Math.ceil(total / size);

    const nextPage =
      page < totalPages ? `/actions?page=${page + 1}&size=${size}` : undefined;
    const prevPage =
      page > 1 ? `/actions?page=${page - 1}&size=${size}` : undefined;

    return {
      totalItems: total,
      totalPages,
      currentPage: page,
      pageSize: size,
      ...(nextPage && { nextPage }),
      ...(prevPage && { prevPage }),
    };
  }
}
