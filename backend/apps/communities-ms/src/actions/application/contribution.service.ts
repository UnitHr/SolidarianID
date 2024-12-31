import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ContributionService {
  abstract makeEconomicContribution(
    userId: string,
    actionId: string,
    date: Date,
    donatedAmount: number,
    description?: string,
  ): Promise<{ id: string }>;

  abstract makeGoodsCollectionContribution(
    userId: string,
    actionId: string,
    date: Date,
    goodType: string,
    donatedQuantity: number,
    unit: string,
    description?: string,
  ): Promise<{ id: string }>;

  abstract makeVolunteerContribution(
    userId: string,
    actionId: string,
    date: Date,
    volunteerNumber: number,
    hoursContributed: number,
    task: string,
    location: string,
    description?: string,
  ): Promise<{ id: string }>;
}
