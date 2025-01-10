import {
  mapODSEnumToDetails,
  ODSEnum,
} from '@common-lib/common-lib/common/ods';
import { Utils } from '@common-lib/common-lib/common/utils';
import { OdsStatisticsResponseDto } from '../dto/ods-statistics-response.dto';
import * as Persistence from '../infra/persistence';
import * as Domain from '../domain';

export class OdsStatisticsMapper {
  static toDomain(raw: Persistence.OdsStatistics): Domain.OdsStatistics {
    const odsStatistics = Domain.OdsStatistics.create(
      raw.odsId as ODSEnum,
      raw.communitiesCount,
      raw.causesCount,
      raw.supportsCount,
    );
    return odsStatistics;
  }

  static toPersistence(
    entity: Domain.OdsStatistics,
  ): Persistence.OdsStatistics {
    return {
      odsId: entity.odsId as number,
      communitiesCount: entity.communitiesCount,
      causesCount: entity.causesCount,
      supportsCount: entity.supportsCount,
    };
  }

  static toDto(
    entity: Domain.OdsStatistics,
    totalSupports: number,
  ): OdsStatisticsResponseDto {
    return {
      ods: mapODSEnumToDetails(entity.odsId),
      communitiesCount: entity.communitiesCount,
      causesCount: entity.causesCount,
      averageSupport: Utils.calculateAverage(
        entity.supportsCount,
        totalSupports,
      ),
    };
  }
}
