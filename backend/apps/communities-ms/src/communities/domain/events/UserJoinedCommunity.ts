export class UserJoinedCommunity {
  public readonly instance: Date = new Date();

  constructor(
    public readonly userId: string,
    public readonly communityId: string,
  ) {}
}
