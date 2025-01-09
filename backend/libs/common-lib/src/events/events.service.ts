import { DomainEvent } from '../core/domain/DomainEvent';

export abstract class EventsService {
  abstract publish<T extends DomainEvent>(
    topic: string,
    event: T,
  ): Promise<void>;
}
