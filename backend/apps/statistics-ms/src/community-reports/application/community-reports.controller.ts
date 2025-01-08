import { Controller, Get, Param } from '@nestjs/common';
import { CommunityReportsService } from './community-reports.service';
import { CommunityReportMapper } from '../mapper/community-report.mapper';

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
    return CommunityReportMapper.toPersistence(communityReport);
  }
}
