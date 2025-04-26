import { ODSEnum } from '../../utils/ods';

export type CauseDetails = {
  id: string;
  title: string;
  description: string;
  endDate: string;
  communityId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  ods: {
    id: number;
    title: string;
    description: string;
  }[];
};

export interface CreateCausePayload {
  title: string;
  description: string;
  end: string; // ISO string
  ods: ODSEnum[];
}

export interface FetchCausesResponse {
  data: CauseDetails[];
  meta: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
}
