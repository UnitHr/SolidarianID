import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '@common-lib/common-lib/auth/decorator/roles.decorator';
import { Role } from '@common-lib/common-lib/auth/role/role.enum';
import { RolesGuard } from '@common-lib/common-lib/auth/roles.guard';
import { OdsStatisticsMapper } from './ods-statistics/mapper/ods-statistics.mapper';
import { OdsStatisticsResponseDto } from './ods-statistics/dto/ods-statistics-response.dto';
import { OdsStatisticsService } from './ods-statistics/application/ods-statistics.service';
import { CommunityStatisticsResponseDto } from './community-statistics/dto/community-statistics-response.dto';
import { CommunityStatisticsService } from './community-statistics/application/community-statistics.service';
import { CommunityStatisticsMapper } from './community-statistics/community-statistics.mapper';

@Controller('statistics')
export class PlatformStatisticsController {
  constructor(
    private readonly odsStatisticsService: OdsStatisticsService,
    private readonly communityStatisticsService: CommunityStatisticsService,
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('ods')
  async findAllOdsStatistics(): Promise<OdsStatisticsResponseDto[]> {
    const odsStatistics = await this.odsStatisticsService.getAll();

    const totalSupports = await this.odsStatisticsService.getTotalSupports();

    return odsStatistics.map((entity) =>
      OdsStatisticsMapper.toDto(entity, totalSupports),
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
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
