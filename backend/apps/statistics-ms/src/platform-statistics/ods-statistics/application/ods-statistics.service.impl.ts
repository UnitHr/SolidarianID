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
    await Promise.all(
      // For each ODS
      mapODSEnumSetToNumberArray(ods).map(async (odsId) => {
        // Fetch the ODS statistics, if it exists
        let odsStatistic =
          await this.odsStatisticsRepository.findOneEntity(odsId);

        // If it doesn't exist, create it
        if (!odsStatistic) {
          odsStatistic = Domain.OdsStatistics.create(odsId as ODSEnum);
        }

        // Increment the causes count
        odsStatistic.incrementCausesCount();

        // Fetch the community
        const community = await this.odsCommunityRepository.findOneEntity(
          odsId,
          communityId,
        );
        if (!community) {
          const newCommunity = Domain.OdsCommunity.create(
            odsStatistic.odsId,
            communityId,
          );

          // Save the community
          await this.odsCommunityRepository.save(newCommunity);

          // We only increment the communities count the first time for each ODS
          odsStatistic.incrementCommunitiesCount();
        }

        // Save the ODS statistics
        await this.odsStatisticsRepository.saveOneEntity(odsStatistic);
      }),
    );
  }

  async registerCauseSupport(ods: Set<ODSEnum>): Promise<void> {
    // For each ODS
    mapODSEnumSetToNumberArray(ods).map(async (odsId) => {
      // Fetch the ODS statistics
      let odsStatistic =
        await this.odsStatisticsRepository.findOneEntity(odsId);

      // If it doesn't exist, create it
      if (!odsStatistic) {
        odsStatistic = Domain.OdsStatistics.create(odsId as ODSEnum);
      }

      // Increment the supports count
      odsStatistic.incrementSupportsCount();

      // Save the ODS statistics
      await this.odsStatisticsRepository.saveOneEntity(odsStatistic);
    });
  }
}
