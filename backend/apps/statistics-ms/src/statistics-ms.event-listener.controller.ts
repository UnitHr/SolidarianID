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

  @EventPattern(CommunityCreatedEvent.TOPIC)
  async handleCommunityCreated(@Payload() message: CommunityCreatedEvent) {
    // CommunityReports logic
    await this.communityReportsService.registerCommunityCreation(
      message.communityId,
      message.name,
      message.adminId,
    );

    // PlatformStatistics logic
    await this.communityStatisticsService.registerComunityCreation(
      message.communityId,
      message.name,
    );

    this.logger.log(
      `Community created event handled: Community:${message.communityId} created`,
    );
  }

  @EventPattern(UserJoinedCommunity.TOPIC)
  async handleJoinCommunityMember(@Payload() message: UserJoinedCommunity) {
    // Only CommunityReports handles this logic
    await this.communityReportsService.registerCommunityJoinMember(
      message.communityId,
    );

    this.logger.log(
      `User joined community event handled: Community:${message.communityId}, User:${message.userId}`,
    );
  }

  @EventPattern(CauseCreatedEvent.TOPIC)
  async handleCauseCreated(@Payload() message: CauseCreatedEvent) {
    // CommunityReports logic
    await this.communityReportsService.registerCauseCreation(
      message.communityId,
      message.causeId,
      message.causeName,
      message.ods,
    );

    // PlatformStatistics logic (ODS Statistics)
    await this.odsStatisticsService.registerCauseCreation(
      message.ods,
      message.communityId,
    );

    this.logger.log(
      `Cause created event handled: Cause:${message.causeId} created`,
    );
  }

  @EventPattern(CauseSupportedEvent.TOPIC)
  async handleCauseAddSupporter(@Payload() message: CauseSupportedEvent) {
    // CommunityReports logic
    await this.communityReportsService.registerCauseAddSupporter(
      message.causeId,
    );

    // PlatformStatistics logic (Community and ODS Statistics)
    await this.communityStatisticsService.registerCauseSupport(
      message.communityId,
    );
    await this.odsStatisticsService.registerCauseSupport(message.ods);

    this.logger.log(
      `Cause add supporter event handled: Cause:${message.causeId} add supporter User:${message.userId}`,
    );
  }

  @EventPattern(ActionCreatedEvent.TOPIC)
  async handleActionCreated(@Payload() message: ActionCreatedEvent) {
    // CommunityReports logic
    await this.communityReportsService.registerActionCreation(
      message.causeId,
      message.id,
      message.title,
      message.target,
    );

    // PlatformStatistics logic (Community Statistics)
    await this.communityStatisticsService.registerCausesTargeted(
      message.communityId,
      message.target,
    );

    this.logger.log(
      `Action created event handled: Action:${message.id} created`,
    );
  }

  @EventPattern(ActionContributedEvent.TOPIC)
  async handleActionContributed(@Payload() message: ActionContributedEvent) {
    // CommunityReports logic
    await this.communityReportsService.registerActionContributed(
      message.actionId,
      message.amount,
    );

    // PlatformStatistics logic (Community Statistics)
    await this.communityStatisticsService.registerCausesAchieved(
      message.communityId,
      message.amount,
    );

    this.logger.log(
      `Action contributed event handled: Action:${message.actionId} contributed, amount:${message.amount}`,
    );
  }
}
