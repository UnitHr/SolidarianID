import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseFilters,
} from '@nestjs/common';
import { CommunityReportsService } from './community-reports.service';
import { CommunityByCommunityIdMapper } from '../mapper/community-by-community-id.mapper';
import { CommunityReportsExceptionFilter } from '../infra/filters/community-reports-domain-exception.filter';

@Controller('statistics')
@UseFilters(CommunityReportsExceptionFilter)
export class CommunityReportsController {
  constructor(
    private readonly communityReportsService: CommunityReportsService,
  ) {}

  @Get('community/:id/report')
  async getCommunityReport(@Param('id', ParseUUIDPipe) communityId: string) {
    const communityReport =
      await this.communityReportsService.findCommunityReport(communityId);
    return CommunityByCommunityIdMapper.toDto(communityReport);
  }
}
