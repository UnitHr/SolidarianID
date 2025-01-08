import {
  mapODSEnumToDetails,
  ODSEnum,
} from '@common-lib/common-lib/common/ods';
import { CommunitiesCausesByOdsResponseDto } from './dto/communities-causes-by-ods-response.dto';
import CommunitiesCausesByOds from './infra/persistence/CommunitiesCausesByOds';
import * as Persistence from './infra/persistence';
import * as Domain from './domain';

export class CommunitiesCausesByOdsMapper {
  static toDomain(
    raw: Persistence.CommunitiesCausesByOds,
  ): Domain.CommunitiesCausesByOds {
    const communitiesCausesByOds = Domain.CommunitiesCausesByOds.create(
      raw.odsId as ODSEnum,
      raw.communitiesCount,
      raw.causesCount,
    );
    return communitiesCausesByOds;
  }

  static toPersistence(
    entity: Domain.CommunitiesCausesByOds,
  ): Persistence.CommunitiesCausesByOds {
    return {
      odsId: entity.odsId as number,
      communitiesCount: entity.communitiesCount,
      causesCount: entity.causesCount,
    };
  }

  static toDto(
    entity: CommunitiesCausesByOds,
  ): CommunitiesCausesByOdsResponseDto {
    return {
      ods: mapODSEnumToDetails(entity.odsId),
      communitiesCount: entity.communitiesCount,
      causesCount: entity.causesCount,
    };
  }
}
