import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  CommunityCreatedEvent,
  UserJoinedCommunity,
} from '@communities-ms/communities/domain/events';
import { ActionCreatedEvent } from '@communities-ms/actions/domain/events/ActionCreatedEvent';
import { ActionContributedEvent } from '@communities-ms/actions/domain/events/ActionContributedEvent';
import { CauseCreatedEvent } from '@communities-ms/causes/domain/events/CauseCreatedEvent';
import { CauseSupportedEvent } from '@communities-ms/causes/domain/events/CauseSupportedEvent';
import { CommunityReportsService } from './community-reports.service';

@Controller()
export class CommunityReportsEventListenerController {
  private readonly logger = new Logger(
    CommunityReportsEventListenerController.name,
  );

  constructor(
    private readonly communityReportsService: CommunityReportsService,
  ) {}

  @EventPattern(CommunityCreatedEvent.TOPIC)
  async handleCommunityCreated(@Payload() message: CommunityCreatedEvent) {
    await this.communityReportsService.registerCommunityCreation(
      message.communityId,
      message.name,
      message.adminId,
    );
    this.logger.log(
      `Community created event handled: Community:${message.communityId} created`,
    );
  }

  @EventPattern(UserJoinedCommunity.TOPIC)
  async handleJoinCommunityMember(@Payload() message: UserJoinedCommunity) {
    await this.communityReportsService.registerCommunityJoinMember(
      message.communityId,
    );
    this.logger.log(
      `User joined community event handled: Community:${message.communityId}, User:${message.userId}`,
    );
  }

  @EventPattern(CauseCreatedEvent.TOPIC)
  async handleCauseCreated(@Payload() message: CauseCreatedEvent) {
    await this.communityReportsService.registerCauseCreation(
      message.communityId,
      message.causeId,
      message.causeName,
      message.ods,
    );
    this.logger.log(
      `Cause created event handled: Cause:${message.causeId} created`,
    );
  }

  @EventPattern(CauseSupportedEvent.TOPIC)
  async handleCauseAddSupporter(@Payload() message: CauseSupportedEvent) {
    // await this.communityReportsService.registerCauseAddSupporter(
    //   message.causeId,
    // );
    this.logger.log(
      `Cause add supporter event handled: Cause:${message.causeId} add supporter User:${message.userId}`,
    );
  }

  @EventPattern(ActionCreatedEvent.TOPIC)
  async handleActionCreated(@Payload() message: ActionCreatedEvent) {
    await this.communityReportsService.registerActionCreation(
      message.causeId,
      message.id,
      message.title,
      message.target,
    );
    this.logger.log(
      `Action created event handled: Action:${message.id} created`,
    );
  }

  @EventPattern(ActionContributedEvent.TOPIC)
  async handleActionContributed(@Payload() message: ActionContributedEvent) {
    await this.communityReportsService.registerActionContributed(
      message.actionId,
      message.amount,
    );
    this.logger.log(
      `Action contributed event handled: Action:${message.actionId} contributed, amount:${message.amount}`,
    );
  }
}
