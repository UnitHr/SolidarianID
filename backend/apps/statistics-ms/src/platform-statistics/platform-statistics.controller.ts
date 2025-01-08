import { Controller, Get } from '@nestjs/common';
import { OdsStatisticsMapper } from './ods-statistics/ods-statistics.mapper';
import { OdsStatisticsResponseDto } from './ods-statistics/dto/ods-statistics-response.dto';
import { OdsStatisticsService } from './ods-statistics/application/ods-statistics.service';
import { CommunityStatisticsResponseDto } from './community-statistics/dto/community-statistics-response.dto';
import { CommunityStatisticsService } from './community-statistics/application/community-statistics.service';
import { CommunityStatisticsMapper } from './community-statistics/community-statistics.mapper';

@Controller('/statistics')
export class PlatformStatisticsController {
  constructor(
    private readonly odsStatisticsService: OdsStatisticsService,
    private readonly communityStatisticsService: CommunityStatisticsService,
  ) {}

  @Get('ods')
  async findAllOdsStatistics(): Promise<OdsStatisticsResponseDto[]> {
    const odsStatistics = await this.odsStatisticsService.getAll();

    const totalSupports = await this.odsStatisticsService.getTotalSupports();

    return odsStatistics.map((entity) =>
      OdsStatisticsMapper.toDto(entity, totalSupports),
    );
  }

  @Get('community')
  async findAllCommunityStatistics(): Promise<
    CommunityStatisticsResponseDto[]
  > {
    const communityStatistics = await this.communityStatisticsService.getAll();

    const totalSupports =
      await this.communityStatisticsService.getTotalSupports();

    return communityStatistics.map((entity) =>
      CommunityStatisticsMapper.toDto(entity, totalSupports),
    );
  }
}
