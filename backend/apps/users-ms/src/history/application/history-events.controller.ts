import { ActionContributedEvent } from '@common-lib/common-lib/events/domain/ActionContributedEvent';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { JoinCommunityRequestCreatedEvent } from '@common-lib/common-lib/events/domain/JoinCommunityRequestCreatedEvent';
import { CauseSupportedEvent } from '@common-lib/common-lib/events/domain/CauseSupportedEvent';
import { JoinCommunityRequestRejectedEvent } from '@common-lib/common-lib/events/domain/JoinCommunityRequestRejectedEvent';
import { CauseCreatedEvent } from '@common-lib/common-lib/events/domain/CauseCreatedEvent';
import { CommunityCreatedEvent } from '@common-lib/common-lib/events/domain/CommunityCreatedEvent';
import { UserJoinedCommunity } from '@common-lib/common-lib/events/domain/UserJoinedCommunity';
import { ApiExcludeController } from '@nestjs/swagger';
import { HistoryService } from './history.service';

@ApiExcludeController()
@Controller()
export class HistoryEventsController {
  private readonly logger = new Logger(HistoryEventsController.name);

  constructor(private readonly historyService: HistoryService) {}

  @EventPattern(CommunityCreatedEvent.TOPIC)
  async handleCommunityCreated(@Payload() message: CommunityCreatedEvent) {
    await this.historyService.registerCommunityCreation(
      message.adminId,
      message.communityId,
      message.date,
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
      message.date,
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
      message.adminId,
      message.date,
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
      message.date,
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
      message.date,
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
      message.date,
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
      message.date,
    );
    this.logger.log(
      `Cause supported event handled: User ${message.userId} supported cause ${message.causeId}`,
    );
  }
}
