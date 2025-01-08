import { ActionContributedEvent } from '@communities-ms/actions/domain/events/ActionContributedEvent';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { HistoryService } from './history.service';

@Controller()
export class HistoryController {
  private readonly logger = new Logger(HistoryController.name);

  constructor(private readonly historyService: HistoryService) {}

  @EventPattern('action-contributed')
  async handleActionContributed(@Payload() message: ActionContributedEvent) {
    await this.historyService.registerActionContribute(
      message.userId,
      message.actionId,
    );
    this.logger.log(
      `Action contributed event handled: User ${message.userId} contributed to action ${message.actionId}`,
    );
  }
}
