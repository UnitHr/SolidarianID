import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CommunityCreatedEvent } from '@communities-ms/communities/domain/events';
import { ActionCreatedEvent } from '@communities-ms/actions/domain/events/ActionCreatedEvent';
import { ActionContributedEvent } from '@communities-ms/actions/domain/events/ActionContributedEvent';
import { CauseSupportedEvent } from '@communities-ms/causes/domain/events/CauseSupportedEvent';
import { CauseCreatedEvent } from '@communities-ms/causes/domain/events/CauseCreatedEvent';
import { CommunityStatisticsService } from './community-statistics/application/community-statistics.service';
import { OdsStatisticsService } from './ods-statistics/application/ods-statistics.service';

@Controller()
export class PlatformStatisticsEventListenerController {
  private readonly logger = new Logger(
    PlatformStatisticsEventListenerController.name,
  );

  constructor(
    private readonly communityStatisticsService: CommunityStatisticsService,
    private readonly odsStatisticsService: OdsStatisticsService,
  ) {}

  @EventPattern(CommunityCreatedEvent.TOPIC)
  async handleCommunityCreated(@Payload() message: CommunityCreatedEvent) {
    await this.communityStatisticsService.registerComunityCreation(
      message.communityId,
      message.name,
    );
    this.logger.log(
      `Community created event handled: Community:${message.communityId} created`,
    );
  }

  @EventPattern(CauseCreatedEvent.TOPIC)
  async handleCauseCreated(@Payload() message: CauseCreatedEvent) {
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
    await this.communityStatisticsService.registerCausesAchieved(
      message.communityId,
      message.amount,
    );
    this.logger.log(
      `Action contributed event handled: Action:${message.actionId} contributed, amount:${message.amount}`,
    );
  }
}
