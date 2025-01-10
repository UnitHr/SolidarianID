import { ActionContributedEvent } from '@communities-ms/actions/domain/events/ActionContributedEvent';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  CommunityCreatedEvent,
  UserJoinedCommunity,
} from '@communities-ms/communities/domain/events';
import { JoinCommunityRequestCreatedEvent } from '@communities-ms/communities/domain/events/JoinCommunityRequestCreatedEvent';
import { CauseCreatedEvent } from '@communities-ms/causes/domain/events/CauseCreatedEvent';
import { CauseSupportedEvent } from '@communities-ms/causes/domain/events/CauseSupportedEvent';
import { JoinCommunityRequestRejectedEvent } from '@communities-ms/communities/domain/events/JoinCommunityRequestRejected';
import { HistoryService } from './history.service';

// TODO: review - event pattern should be in a shared module
@Controller()
export class HistoryController {
  private readonly logger = new Logger(HistoryController.name);

  constructor(private readonly historyService: HistoryService) {}

  @EventPattern(CommunityCreatedEvent.TOPIC)
  async handleCommunityCreated(@Payload() message: CommunityCreatedEvent) {
    await this.historyService.registerCommunityCreation(
      message.adminId,
      message.communityId,
    );
    this.logger.log(
      `Community created event handled: Community ${message.communityId} created`,
    );
  }

  @EventPattern(ActionContributedEvent.TOPIC)
  async handleActionContributed(@Payload() message: ActionContributedEvent) {
    await this.historyService.registerActionContribute(
      message.userId,
      message.actionId,
    );
    this.logger.log(
      `Action contributed event handled: User ${message.userId} contributed to action ${message.actionId}`,
    );
  }

  @EventPattern(JoinCommunityRequestCreatedEvent.TOPIC)
  async handleJoinCommunityRequestCreated(
    @Payload() message: JoinCommunityRequestCreatedEvent,
  ) {
    await this.historyService.registerJoinCommunityRequest(
      message.userId,
      message.communityId,
    );
    this.logger.log(
      `Join community request created event handled: User ${message.userId} requested to join community ${message.communityId}`,
    );
  }

  @EventPattern(JoinCommunityRequestRejectedEvent.TOPIC)
  async handleJoinCommunityRequestRejected(
    @Payload() message: JoinCommunityRequestRejectedEvent,
  ) {
    await this.historyService.registerJoinCommunityRequestRejected(
      message.userId,
      message.communityId,
    );
    this.logger.log(
      `Join community request rejected event handled: User ${message.userId} requested to join community ${message.communityId}`,
    );
  }

  @EventPattern(UserJoinedCommunity.TOPIC)
  async handleUserJoinedCommunity(@Payload() message: UserJoinedCommunity) {
    await this.historyService.registerUserJoinedCommunity(
      message.userId,
      message.communityId,
    );
    this.logger.log(
      `User joined community event handled: User ${message.userId} joined community ${message.communityId}`,
    );
  }

  @EventPattern(CauseCreatedEvent.TOPIC)
  async handleCauseCreated(@Payload() message: CauseCreatedEvent) {
    await this.historyService.registerCauseCreation(
      message.userId,
      message.causeId,
    );
    this.logger.log(
      `Cause created event handled: User ${message.userId} created cause ${message.causeId}`,
    );
  }

  @EventPattern(CauseSupportedEvent.TOPIC)
  async handleCauseSupported(@Payload() message: CauseSupportedEvent) {
    await this.historyService.registerCauseSupported(
      message.userId,
      message.causeId,
    );
    this.logger.log(
      `Cause supported event handled: User ${message.userId} supported cause ${message.causeId}`,
    );
  }
}
