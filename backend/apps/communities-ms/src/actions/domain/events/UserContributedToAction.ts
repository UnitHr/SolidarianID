export class UserContributedToAction {
  public readonly instance: Date = new Date();

  constructor(
    public readonly userId: string,
    public readonly actionId: string,
  ) {}
}
