import { IEvent } from '@nestjs/cqrs';

export abstract class DomainEvent implements IEvent {
  public readonly type: string;

  public readonly date: Date;

  constructor(type: string) {
    this.type = type;
    this.date = new Date();
  }
}
