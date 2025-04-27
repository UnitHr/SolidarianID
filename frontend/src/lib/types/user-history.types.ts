export type Following = {
  followedUserId: string;
  fullName: string;
};

export type Follower = {
  followerId: string;
  fullName: string;
};

export type HistoryEntry = {
  type: string;
  entityId: string;
  entityName: string;
  timestamp: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
  };
};
