export class PaginatedResponseDto<T> {
  data: T[];

  meta: {
    total: number;

    page: number;

    limit: number;

    totalPages: number;

    hasNextPage: boolean;

    hasPreviousPage: boolean;
  };

  links: {
    self: string;

    next?: string;

    previous?: string;
  };

  constructor(
    data: T[],
    total: number,
    page: number,
    limit: number,
    baseUrl: string,
  ) {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1 && page <= totalPages + 1;

    this.data = data;

    this.meta = {
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };

    this.links = {
      self: `${baseUrl}?page=${page}&limit=${limit}`,
      next: hasNextPage
        ? `${baseUrl}?page=${page + 1}&limit=${limit}`
        : undefined,
      previous: hasPreviousPage
        ? `${baseUrl}?page=${page - 1}&limit=${limit}`
        : undefined,
    };
  }
}
