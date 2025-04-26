export type OdsItem = {
    id: number;
    title: string;
    description: string;
  };
  
  export type CauseDetails = {
    id: string;
    title: string;
    description: string;
    communityId: string;
    createdAt: string;
    createdBy: string;
    endDate: string;
    ods: OdsItem[];
  };
  
  export type ActionDetails = {
    id: string;
    title: string;
    description: string;
    causeId: string;
    status: string;
  };