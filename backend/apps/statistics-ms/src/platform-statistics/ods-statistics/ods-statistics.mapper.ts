import {
  mapODSEnumToDetails,
  ODSEnum,
} from '@common-lib/common-lib/common/ods';
import { OdsStatisticsResponseDto } from './dto/ods-statistics-response.dto';
import OdsStatistics from './infra/persistence/OdsStatistics';
import * as Persistence from './infra/persistence';
import * as Domain from './domain';
import { Utils } from '@common-lib/common-lib/common/utils';
import e from 'express';

export class OdsStatisticsMapper {
  static toDomain(raw: Persistence.OdsStatistics): Domain.OdsStatistics {
    const OdsStatistics = Domain.OdsStatistics.create(
      raw.odsId as ODSEnum,
      raw.communitiesCount,
      raw.causesCount,
      raw.supportsCount,
    );
    return OdsStatistics;
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
    entity: OdsStatistics,
    totalSupports: number,
  ): OdsStatisticsResponseDto {
    return {
      ods: mapODSEnumToDetails(entity.odsId),
      communitiesCount: entity.communitiesCount,
      causesCount: entity.causesCount,
      averageSupports: Utils.calculateAverage(
        entity.supportsCount,
        totalSupports,
      ),
    };
  }
}
