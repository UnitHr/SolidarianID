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

  @EventPattern(CommunityCreatedEvent.EVENT_TYPE)
  async handleCommunityCreated(@Payload() message: CommunityCreatedEvent) {
    await this.historyService.registerCommunityCreation(
      message.adminId,
      message.communityId,
      message.communityName,
      message.date,
    );

    await this.historyService.registerUserJoinedCommunity(
      message.adminId,
      message.communityId,
      message.communityName,
      message.date,
    );
    this.logger.log(
      `Community created event handled: Community ${message.communityId} created`,
    );
  }

  @EventPattern(ActionContributedEvent.EVENT_TYPE)
  async handleActionContributed(@Payload() message: ActionContributedEvent) {
    await this.historyService.registerActionContribute(
      message.userId,
      message.actionId,
      message.actionName,
      message.date,
    );
    this.logger.log(
      `Action contributed event handled: User ${message.userId} contributed to action ${message.actionId}`,
    );
  }

  @EventPattern(JoinCommunityRequestCreatedEvent.EVENT_TYPE)
  async handleJoinCommunityRequestCreated(
    @Payload() message: JoinCommunityRequestCreatedEvent,
  ) {
    await this.historyService.registerJoinCommunityRequest(
      message.userId,
      message.communityId,
      message.communityName,
      message.adminId,
      message.date,
    );
    this.logger.log(
      `Join community request created event handled: User ${message.userId} requested to join community ${message.communityId}`,
    );
  }

  @EventPattern(JoinCommunityRequestRejectedEvent.EVENT_TYPE)
  async handleJoinCommunityRequestRejected(
    @Payload() message: JoinCommunityRequestRejectedEvent,
  ) {
    await this.historyService.registerJoinCommunityRequestRejected(
      message.userId,
      message.communityId,
      message.communityName,
      message.date,
    );
    this.logger.log(
      `Join community request rejected event handled: User ${message.userId} requested to join community ${message.communityId}`,
    );
  }

  @EventPattern(UserJoinedCommunity.EVENT_TYPE)
  async handleUserJoinedCommunity(@Payload() message: UserJoinedCommunity) {
    await this.historyService.registerUserJoinedCommunity(
      message.userId,
      message.communityId,
      message.communityName,
      message.date,
    );
    this.logger.log(
      `User joined community event handled: User ${message.userId} joined community ${message.communityId}`,
    );
  }

  @EventPattern(CauseCreatedEvent.EVENT_TYPE)
  async handleCauseCreated(@Payload() message: CauseCreatedEvent) {
    await this.historyService.registerCauseCreation(
      message.userId,
      message.causeId,
      message.causeName,
      message.date,
    );
    this.logger.log(
      `Cause created event handled: User ${message.userId} created cause ${message.causeId}`,
    );
  }

  @EventPattern(CauseSupportedEvent.EVENT_TYPE)
  async handleCauseSupported(@Payload() message: CauseSupportedEvent) {
    await this.historyService.registerCauseSupported(
      message.userId,
      message.causeId,
      message.causeName,
      message.date,
    );
    this.logger.log(
      `Cause supported event handled: User ${message.userId} supported cause ${message.causeId}`,
    );
  }
}
