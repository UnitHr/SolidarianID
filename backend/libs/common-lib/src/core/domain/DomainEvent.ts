import { IEvent } from '@nestjs/cqrs';

export abstract class DomainEvent implements IEvent {
  public readonly type: string;

  public readonly date: Date;

  public static readonly TOPIC?: string;

  constructor(type: string, date?: Date) {
    this.type = type;
    this.date = date ?? new Date();
  }

  public shouldBePublishedExternally(): boolean {
    return !!(this.constructor as typeof DomainEvent).TOPIC;
  }

  public getTopic(): string | undefined {
    return (this.constructor as typeof DomainEvent).TOPIC;
  }
}
