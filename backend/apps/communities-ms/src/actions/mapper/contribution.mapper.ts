import { error } from 'console';
import * as Domain from '../domain';
import * as Persistence from '../infra/persistence';

export class ContributionMapper {
  static toDomain(document: Persistence.Contribution): Domain.Contribution {
    const { id, userId, actionId, date, description } = document;
    if (document.type === 'economic') {
      return Domain.EconomicContribution.create(
        {
          userId,
          actionId,
          date,
          description,
          donatedAmount: document.donatedAmount,
        },
        id,
      );
    }
    if (document.type === 'goodsCollection') {
      return Domain.GoodsContribution.create(
        {
          userId,
          actionId,
          date,
          description,
          goodType: document.goodType,
          donatedQuantity: document.donatedQuantity,
          unit: document.unit,
        },
        id,
      );
    }
    if (document.type === 'volunteer') {
      return Domain.VolunteerContribution.create(
        {
          userId,
          actionId,
          date,
          description,
          volunteerNumber: document.volunteerNumber,
          hoursContributed: document.hoursContributed,
          task: document.task,
          location: document.location,
        },
        id,
      );
    }
    throw error(`Unknown action type: ${document.constructor.name}`);
  }

  static toPersistence(
    contribution: Domain.Contribution,
  ): Persistence.Contribution {
    const commonProps = {
      id: contribution.id.toString(),
      userId: contribution.userId,
      actionId: contribution.actionId,
      date: contribution.date,
      description: contribution.description,
    };
    if (contribution instanceof Domain.EconomicContribution) {
      return {
        ...commonProps,
        type: 'economic',
        donatedAmount: contribution.donatedAmount,
      };
    }
    if (contribution instanceof Domain.GoodsContribution) {
      return {
        ...commonProps,
        type: 'goodsCollection',
        goodType: contribution.goodType,
        donatedQuantity: contribution.donatedQuantity,
        unit: contribution.unit,
      };
    }
    if (contribution instanceof Domain.VolunteerContribution) {
      return {
        ...commonProps,
        type: 'goodsCollection',
        volunteerNumber: contribution.volunteerNumber,
        hoursContributed: contribution.hoursContributed,
        task: contribution.task,
        location: contribution.location,
      };
    }
    throw error(`Unknown action type: ${contribution.constructor.name}`);
  }
}
