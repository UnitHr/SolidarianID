import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { GetUserId } from '@common-lib/common-lib/auth/decorator/getUserId.decorator';
import { GetUserRole } from '@common-lib/common-lib/auth/decorator/getUserRole.decorator';
import { Role } from '@common-lib/common-lib/auth/role/role.enum';
import { Roles } from '@common-lib/common-lib/auth/decorator/roles.decorator';
import { RolesGuard } from '@common-lib/common-lib/auth/roles.guard';
import { CommunityReportsService } from './community-reports.service';
import { CommunityByCommunityIdMapper } from '../mapper/community-by-community-id.mapper';
import { CommunityReportsExceptionFilter } from '../infra/filters/community-reports-domain-exception.filter';
import { UserNotAuthorizedError } from '../exceptions';

@Controller('statistics')
@UseFilters(CommunityReportsExceptionFilter)
export class CommunityReportsController {
  constructor(
    private readonly communityReportsService: CommunityReportsService,
  ) {}

  @Get('community/:id/report')
  async getCommunityReport(
    @Param('id', ParseUUIDPipe) communityId: string,
    @GetUserId() userId: string,
    @GetUserRole() userRole: string,
  ) {
    const communityReport =
      await this.communityReportsService.findCommunityReport(communityId);

    if (
      // If not
      !(
        userRole === Role.ADMIN || // Is platform admin or
        (userRole === Role.USER && userId === communityReport.adminId) // Is community admin
      )
    ) {
      throw new UserNotAuthorizedError();
    }

    return CommunityByCommunityIdMapper.toDto(communityReport);
  }
}
