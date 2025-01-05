import { Controller, Get } from '@nestjs/common';
import { CommunitiesCausesByOdsMapper } from './communities-causes-by-ods/communities-causes-by-ods.mapper';
import { CommunitiesCausesByOdsResponseDto } from './communities-causes-by-ods/dto/communities-causes-by-ods-response.dto';
import { CommunitiesCausesByOdsService } from './communities-causes-by-ods/application/communities-causes-by-ods.service';

@Controller('/statistics')
export class PlatformStatisticsController {
  constructor(
    private readonly communitiesCausesByOdsService: CommunitiesCausesByOdsService,
  ) {}

  @Get('/ods/communities-causes')
  async findAllHotels(): Promise<CommunitiesCausesByOdsResponseDto[]> {
    const communitiesCausesByOds =
      await this.communitiesCausesByOdsService.getAll();

    return communitiesCausesByOds.map(CommunitiesCausesByOdsMapper.toDto);
  }
}
