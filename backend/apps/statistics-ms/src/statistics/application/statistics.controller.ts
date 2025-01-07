import { ActionCreatedEvent } from '@communities-ms/actions/domain/events/ActionCreatedEvent';
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class StatisticsController {
  private readonly logger = new Logger(StatisticsController.name);

  @EventPattern('action-created')
  async handleActionCreated(@Payload() message: ActionCreatedEvent) {
    this.logger.log(`Evento recibido: ${JSON.stringify(message)}`);
    // Procesar la lógica del evento
  }
}
