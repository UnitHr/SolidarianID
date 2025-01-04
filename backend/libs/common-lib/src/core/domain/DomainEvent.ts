export abstract class DomainEvent {
  public readonly type: string;

  public readonly date: Date;

  constructor(type: string) {
    this.type = type;
    this.date = new Date();
  }
}
