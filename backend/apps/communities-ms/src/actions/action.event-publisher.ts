import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';
import { EventPublisher } from '@nestjs/cqrs';

export abstract class ActionEventPublisher extends EventPublisher {
  abstract publish(event: DomainEvent): Promise<void>;
}
