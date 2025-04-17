import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

// Events
import { ActionContributedEvent } from '@common-lib/common-lib/events/domain/ActionContributedEvent';
import { CauseSupportedEvent } from '@common-lib/common-lib/events/domain/CauseSupportedEvent';
import { ActionCreatedEvent } from '@common-lib/common-lib/events/domain/ActionCreatedEvent';
import { CauseCreatedEvent } from '@common-lib/common-lib/events/domain/CauseCreatedEvent';
import { CommunityCreatedEvent } from '@common-lib/common-lib/events/domain/CommunityCreatedEvent';
import { UserJoinedCommunity } from '@common-lib/common-lib/events/domain/UserJoinedCommunity';

// Services
import { CommunityReportsService } from './community-reports/application/community-reports.service';
import { CommunityStatisticsService } from './platform-statistics/community-statistics/application/community-statistics.service';
import { OdsStatisticsService } from './platform-statistics/ods-statistics/application/ods-statistics.service';

@Controller()
export class StatisticsMsEventListenerController {
  private readonly logger = new Logger(
    StatisticsMsEventListenerController.name,
  );

  constructor(
    private readonly communityReportsService: CommunityReportsService,
    private readonly communityStatisticsService: CommunityStatisticsService,
    private readonly odsStatisticsService: OdsStatisticsService,
  ) {}

  @EventPattern(CommunityCreatedEvent.EVENT_TYPE)
  async handleCommunityCreated(@Payload() message: CommunityCreatedEvent) {
    this.logger.log(
      `Community created event handled: ${JSON.stringify(message)}`,
    );

    // CommunityReports and PlatformStatistics logic
    await Promise.all([
      this.communityReportsService.registerCommunityCreation(
        message.communityId,
        message.name,
        message.adminId,
      ),
      this.communityStatisticsService.registerCommunityCreation(
        message.communityId,
        message.name,
      ),
    ]);
  }

  @EventPattern(UserJoinedCommunity.EVENT_TYPE)
  async handleJoinCommunityMember(@Payload() message: UserJoinedCommunity) {
    this.logger.log(
      `User joined community event handled: ${JSON.stringify(message)}`,
    );

    // Only CommunityReports handles this logic
    await this.communityReportsService.registerCommunityJoinMember(
      message.communityId,
    );
  }

  @EventPattern(CauseCreatedEvent.EVENT_TYPE)
  async handleCauseCreated(@Payload() message: CauseCreatedEvent) {
    this.logger.log(`Cause created event handled: ${JSON.stringify(message)}`);

    // CommunityReports and PlatformStatistics logic
    await Promise.all([
      this.communityReportsService.registerCauseCreation(
        message.communityId,
        message.causeId,
        message.causeName,
        new Set(message.ods),
      ),
      this.odsStatisticsService.registerCauseCreation(
        new Set(message.ods),
        message.communityId,
      ),
    ]);
  }

  @EventPattern(CauseSupportedEvent.EVENT_TYPE)
  async handleCauseAddSupporter(@Payload() message: CauseSupportedEvent) {
    this.logger.log(
      `Cause add supporter event handled: ${JSON.stringify(message)}`,
    );

    // CommunityReports and PlatformStatistics logic
    await Promise.all([
      this.communityReportsService.registerCauseAddSupporter(
        message.communityId,
        message.causeId,
      ),
      this.communityStatisticsService.registerCauseSupport(message.communityId),
      this.odsStatisticsService.registerCauseSupport(new Set(message.ods)),
    ]);
  }

  @EventPattern(ActionCreatedEvent.EVENT_TYPE)
  async handleActionCreated(@Payload() message: ActionCreatedEvent) {
    this.logger.log(`Action created event handled: ${JSON.stringify(message)}`);

    // CommunityReports and PlatformStatistics logic
    await Promise.all([
      this.communityReportsService.registerActionCreation(
        message.causeId,
        message.id,
        message.title,
        message.target,
      ),
      this.communityStatisticsService.registerCausesTargeted(
        message.communityId,
        message.target,
      ),
    ]);
  }

  @EventPattern(ActionContributedEvent.EVENT_TYPE)
  async handleActionContributed(@Payload() message: ActionContributedEvent) {
    this.logger.log(
      `Action contributed event handled: ${JSON.stringify(message)}`,
    );

    // CommunityReports and PlatformStatistics logic
    await Promise.all([
      this.communityReportsService.registerActionContributed(
        message.causeId,
        message.actionId,
        message.amount,
      ),
      this.communityStatisticsService.registerCausesAchieved(
        message.communityId,
        message.amount,
      ),
    ]);
  }
}
