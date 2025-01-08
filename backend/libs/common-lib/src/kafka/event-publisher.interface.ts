import { DomainEvent } from '../core/domain/DomainEvent';

export abstract class EventPublisher {
  abstract emitEvent(topic: string, event: DomainEvent): Promise<void>;
}
