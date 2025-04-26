export type ActionDetails = {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  causeId: string;
  target: number;
  unit: string;
  achieved: number;
  goodType?: string;
  location?: string;
  date?: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};

export interface FetchActionsResponse {
  data: ActionDetails[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}
