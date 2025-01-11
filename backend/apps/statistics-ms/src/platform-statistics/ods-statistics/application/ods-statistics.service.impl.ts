import { Injectable } from '@nestjs/common';
import {
  mapODSEnumSetToNumberArray,
  ODSEnum,
} from '@common-lib/common-lib/common/ods';
import { OdsStatisticsService } from './ods-statistics.service';
import OdsStatisticsRepository from '../infra/ods-statistics.repository.cassandra';
import OdsCommunityRepository from '../infra/ods-community.repository.cassandra';
import * as Domain from '../domain';

@Injectable()
export class OdsStatisticsServiceImpl implements OdsStatisticsService {
  constructor(
    private readonly odsStatisticsRepository: OdsStatisticsRepository,
    private readonly odsCommunityRepository: OdsCommunityRepository,
  ) {}

  getAll(): Promise<Domain.OdsStatistics[]> {
    return this.odsStatisticsRepository.findAllEntities();
  }

  getTotalSupports(): Promise<number> {
    return this.odsStatisticsRepository.getTotalSupports();
  }

  async registerCauseCreation(
    ods: Set<ODSEnum>,
    communityId: string,
  ): Promise<void> {
    // Fetch the ODS statistics
    const odsStatistics = await this.odsStatisticsRepository.findManyEntities(
      mapODSEnumSetToNumberArray(ods),
    );

    // Update the communities and causes count
    odsStatistics.forEach(async (odsStatistic) => {
      odsStatistic.incrementCausesCount(); // Increment the causes count

      // Fetch the community
      const community = await this.odsCommunityRepository.findById(communityId);
      if (!community) {
        const newCommunity = Domain.OdsCommunity.create(
          odsStatistic.odsId,
          communityId,
        );

        // Save the community
        await this.odsCommunityRepository.save(newCommunity);

        // We only increment the communities count the first time for each ODS
        odsStatistic.incrementCommunitiesCount(); // Increment the communities count
      }
    });

    // Save
    await this.odsStatisticsRepository.saveManyEntities(odsStatistics);
  }

  async registerCauseSupport(ods: Set<ODSEnum>): Promise<void> {
    // Fetch the ODS statistics
    const odsStatistics = await this.odsStatisticsRepository.findManyEntities(
      Array.from(ods).map((odsEnum) => odsEnum as number),
    );

    // Update the supports count
    odsStatistics.forEach((odsStatistic) => {
      odsStatistic.incrementSupportsCount();
    });

    // Save
    await this.odsStatisticsRepository.saveManyEntities(odsStatistics);
  }
}
