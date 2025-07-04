export enum ActionStatusEnum {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum ActionTypeEnum {
  VOLUNTEER = 'volunteer',
  ECONOMIC = 'economic',
  GOODS_COLLECTION = 'goods_collection',
}

export const ActionStatusLabels: Record<ActionStatusEnum, string> = {
  [ActionStatusEnum.PENDING]: 'Pending',
  [ActionStatusEnum.IN_PROGRESS]: 'In Progress',
  [ActionStatusEnum.COMPLETED]: 'Completed',
};

export const ActionTypeLabels: Record<ActionTypeEnum, string> = {
  [ActionTypeEnum.VOLUNTEER]: 'Volunteer',
  [ActionTypeEnum.ECONOMIC]: 'Economic',
  [ActionTypeEnum.GOODS_COLLECTION]: 'Goods Collection',
};

export type ActionDetails = {
  id: string;
  title: string;
  description: string;
  type: ActionTypeEnum;
  status: ActionStatusEnum;
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

export interface CreateActionPayload {
  type: ActionTypeEnum;
  title: string;
  description: string;
  target: number;
  unit: string;
  goodType?: string;
  location?: string;
  date?: string; // ISO string
}

export type CreateContributionPayload = {
  date: string; // ISO string
  amount: number;
  unit: string;
};
