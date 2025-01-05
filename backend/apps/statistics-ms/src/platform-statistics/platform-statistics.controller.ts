import { Controller, Get } from '@nestjs/common';
import { OdsStatisticsMapper } from './ods-statistics/ods-statistics.mapper';
import { OdsStatisticsResponseDto } from './ods-statistics/dto/ods-statistics-response.dto';
import { OdsStatisticsService } from './ods-statistics/application/ods-statistics.service';

@Controller('/statistics')
export class PlatformStatisticsController {
  constructor(private readonly odsStatisticsService: OdsStatisticsService) {}

  @Get('ods')
  async findAllOdsStatistics(): Promise<OdsStatisticsResponseDto[]> {
    const OdsStatistics = await this.odsStatisticsService.getAll();

    const totalSupports = await this.odsStatisticsService.getTotalSupports();

    return OdsStatistics.map((entity) =>
      OdsStatisticsMapper.toDto(entity, totalSupports),
    );
  }
}
