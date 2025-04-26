export type CommunityDetails = {
  id: string;
  name: string;
  description: string;
  adminId: string;
};

export interface FetchCommunitiesResponse {
  data: CommunityDetails[];
  meta: { totalPages: number };
}
