import { Utils } from '@common-lib/common-lib/common/utils';
import { CommunityStatisticsResponseDto } from './dto/community-statistics-response.dto';
import * as Persistence from './infra/persistence';
import * as Domain from './domain';

export class CommunityStatisticsMapper {
  static toDomain(
    raw: Persistence.CommunityStatistics,
  ): Domain.CommunityStatistics {
    const communityStatistics = Domain.CommunityStatistics.create(
      raw.communityId,
      raw.communityName,
      raw.supportCount,
      raw.actionsTargetTotal,
      raw.actionsAchievedTotal,
    );
    return communityStatistics;
  }

  static toPersistence(
    entity: Domain.CommunityStatistics,
  ): Persistence.CommunityStatistics {
    return {
      communityId: entity.communityId,
      communityName: entity.communityName,
      supportCount: entity.supportCount,
      actionsTargetTotal: entity.actionsTargetTotal,
      actionsAchievedTotal: entity.actionsAchievedTotal,
    };
  }

  static toDto(
    entity: Domain.CommunityStatistics,
    totalSupports: number,
  ): CommunityStatisticsResponseDto {
    return {
      communityId: entity.communityId,
      communityName: entity.communityName,
      averageSupport: Utils.calculateAverage(
        entity.supportCount,
        totalSupports,
      ),
      averageActionsProgress: Utils.calculateAverage(
        entity.actionsAchievedTotal,
        entity.actionsTargetTotal,
      ),
    };
  }
}
