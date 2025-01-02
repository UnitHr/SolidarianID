import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { mapODSEnumListToDetails } from '@common-lib/common-lib/common/ods';
import { CauseDto } from './dto/cause.dto';
import { CauseEndDate } from './domain/CauseEndDate';
import * as Persistence from './infra/persistence';
import * as Domain from './domain';

export class CauseMapper {
  static toDomain(raw: Persistence.Cause): Domain.Cause {
    return Domain.Cause.create(
      {
        ...raw,
        endDate: CauseEndDate.create(raw.endDate),
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
      actionsIds: cause.actionsIds,
      supportersIds: cause.supportersIds,
    };
  }

  static toDTO(cause: Domain.Cause): CauseDto {
    return {
      id: cause.id.toString(),
      title: cause.title,
      description: cause.description,
      ods: mapODSEnumListToDetails(cause.ods),
      endDate: cause.endDate.value,
      communityId: cause.communityId,
    };
  }
}
