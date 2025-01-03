import * as Domain from '../domain';
import * as Persistence from '../infra/persistence';
import { ContributionDto } from '../dto/contribution.dto';

export class ContributionMapper {
  static toDomain(document: Persistence.Contribution): Domain.Contribution {
    const { id, userId, actionId, date, amount, unit } = document;
    return Domain.Contribution.create(
      { userId, actionId, date, amount, unit },
      id,
    );
  }

  static toPersistence(
    contribution: Domain.Contribution,
  ): Persistence.Contribution {
    const commonProps = {
      id: contribution.id.toString(),
      userId: contribution.userId,
      actionId: contribution.actionId,
      date: contribution.date,
      amount: contribution.amount,
      unit: contribution.unit,
    };
    return { ...commonProps };
  }

  static toDTO(contribution: Domain.Contribution): ContributionDto {
    return {
      id: contribution.id.toString(),
      userId: contribution.userId,
      // actionId: contribution.actionId,
      date: contribution.date,
      // amount: contribution.amount,
      // unit: contribution.unit,
    };
  }
}
