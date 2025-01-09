import { Controller, Logger } from '@nestjs/common';
import { CommunityReportsService } from './community-reports.service';

@Controller()
export class CommunityReportsEventListenerController {
  private readonly logger = new Logger(
    CommunityReportsEventListenerController.name,
  );

  constructor(
    private readonly communityReportsService: CommunityReportsService,
  ) {}
}
