import { Controller, Get, Param } from '@nestjs/common';
import { CommunityReportsService } from './community-reports.service';
import { CommunityByCommunityIdMapper } from '../mapper/community-by-community-id.mapper';

@Controller('statistics')
export class CommunityReportsController {
  constructor(
    private readonly communityReportsService: CommunityReportsService,
  ) {}

  @Get('community/:id/report')
  // TODO: Add ParseUUIDPipe to the id parameter
  async getCommunityReport(@Param('id') communityId: string) {
    const communityReport =
      await this.communityReportsService.findOne(communityId);
    return CommunityByCommunityIdMapper.toDto(communityReport);
  }
}
