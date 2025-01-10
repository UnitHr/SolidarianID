import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CommunityCreatedEvent } from '@communities-ms/communities/domain/events';
import { ActionCreatedEvent } from '@communities-ms/actions/domain/events/ActionCreatedEvent';
import { ActionContributedEvent } from '@communities-ms/actions/domain/events/ActionContributedEvent';
import { CauseSupportedEvent } from '@communities-ms/causes/domain/events/CauseSupportedEvent';
import { CommunityStatisticsService } from './community-statistics/application/community-statistics.service';
import { OdsStatisticsService } from './ods-statistics/application/ods-statistics.service';
import { CauseCreatedEvent } from '@communities-ms/causes/domain/events/CauseCreatedEvent';

@Controller()
export class PlatformStatisticsEventListenerController {
  private readonly logger = new Logger(
    PlatformStatisticsEventListenerController.name,
  );

  constructor(
    private readonly communityStatisticsService: CommunityStatisticsService,
    private readonly odsStatisticsService: OdsStatisticsService,
  ) {}

  @EventPattern('community-created')
  async handleCommunityCreated(@Payload() message: CommunityCreatedEvent) {
    await this.communityStatisticsService.registerComunityCreation(
      message.communityId,
      message.name,
    );
    this.logger.log(
      `Community created event handled: Community:${message.communityId} created`,
    );
  }

  @EventPattern('cause-created')
  async handleCauseCreated(@Payload() message: CauseCreatedEvent) {
    await this.odsStatisticsService.registerCauseCreation(
      message.ods,
      message.communityId,
    );
    this.logger.log(
      `Cause created event handled: Cause:${message.causeId} created`,
    );
  }

  @EventPattern('cause-supported')
  async handleCauseAddSupporter(@Payload() message: CauseSupportedEvent) {
    await this.communityStatisticsService.registerCauseSupport(
      message.communityId,
    );
    // TODO: Uncomment this line when CauseSupportedEvent contains the ods list of the cause
    // await this.odsStatisticsService.registerCauseSupport(message.ods);
    this.logger.log(
      `Cause add supporter event handled: Cause:${message.causeId} add supporter User:${message.userId}`,
    );
  }

  @EventPattern('action-created')
  async handleActionCreated(@Payload() message: ActionCreatedEvent) {
    await this.communityStatisticsService.registerCausesTargeted(
      message.communityId,
      message.target,
    );
    this.logger.log(
      `Action created event handled: Action:${message.id} created`,
    );
  }

  @EventPattern('action-contributed')
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
