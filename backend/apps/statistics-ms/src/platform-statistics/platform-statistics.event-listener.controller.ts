import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CommunityCreatedEvent } from '@communities-ms/communities/domain/events';
import { ActionCreatedEvent } from '@communities-ms/actions/domain/events/ActionCreatedEvent';
import { OdsStatisticsService } from './ods-statistics/application/ods-statistics.service';
import { CommunityStatisticsService } from './community-statistics/application/community-statistics.service';

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

  @EventPattern('cause-add-supporter')
  async handleCauseAddSupporter(@Payload() message: any) {
    // TODO: Fix type
    await this.communityStatisticsService.registerCauseSupport(message.causeId);
    this.logger.log(
      `Cause add supporter event handled: Cause:${message.causeId} add supporter User:${message.userId}`,
    );
  }

  @EventPattern('action-created')
  async handleActionCreated(@Payload() message: any) {
    // TODO: Fix type
    await this.communityStatisticsService.registerCausesTargeted(
      message.communityId,
      message.target,
    );
    this.logger.log(
      `Action created event handled: Action:${message.id} created`,
    );
  }

  @EventPattern('action-contributed')
  async handleActionContributed(@Payload() message: any) {
    // TODO: Fix type
    await this.communityStatisticsService.registerCausesAchieved(
      message.communityId,
      message.amount,
    );
    this.logger.log(
      `Action contributed event handled: Action:${message.actionId} contributed, amount:${message.amount}`,
    );
  }
}
