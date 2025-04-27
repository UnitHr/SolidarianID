import { ODSEnum } from '../../utils/ods';

export type CommunityDetails = {
  id: string;
  name: string;
  description: string;
  adminId: string;
  admin?: {
    id: string;
    firstName: string;
    lastName: string;
  };
};

export interface FetchCommunitiesResponse {
  data: CommunityDetails[];
  meta: { totalPages: number };
}

export interface CreateCommunityRequestPayload {
  name: string;
  description: string;
  cause: {
    title: string;
    description: string;
    end: string; // ISO Date string
    ods: ODSEnum[];
  };
}

export type CreationRequestType = {
  id: string;
  communityName: string;
  communityDescription: string;
  userId: string;
  causeTitle: string;
  causeDescription: string;
  causeEndDate: string;
  causeOds: { title: string }[];
};
