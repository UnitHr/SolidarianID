import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import * as Domain from './domain';
import { CauseDto } from './dto/cause.dto';
import * as Persistence from './infra/persistence';
import { CauseEndDate } from './domain/CauseEndDate';

export class CauseMapper {
  static toDomain(raw: Persistence.Cause): Domain.Cause {
    return Domain.Cause.create(
      {
        ...raw,
        ods: raw.ods as number[],
        endDate: CauseEndDate.create(raw.endDate).getValue(),
        actions: raw.actions as string[],
        supporters: raw.supporters as string[],
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(cause: Domain.Cause): Persistence.Cause {
    return {
      id: cause.id.toString(),
      title: cause.title,
      description: cause.description,
      ods: cause.ods,
      endDate: cause.endDate.value,
      communityId: cause.communityId,
      actions: cause.actions,
      supporters: cause.supporters,
    };
  }

  static toDTO(cause: Domain.Cause): CauseDto {
    return {
      id: cause.id.toString(),
      title: cause.title,
      description: cause.description,
      ods: cause.ods, // TODO: Map to ODS dictionary to show the name and description
      endDate: cause.endDate.value,
      communityId: cause.communityId,
      // TODO: ? Add actions and supporters
    };
  }
}
