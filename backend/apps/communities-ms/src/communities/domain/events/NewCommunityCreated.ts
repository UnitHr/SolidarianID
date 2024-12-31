export class NewCommunityCreated {
  public readonly instance: Date = new Date();

  constructor(
    public readonly causeTitle: string,
    public readonly causeDescription: string,
    public readonly causeEndDate: Date,
    public readonly causeOds: number[],
  ) {}
}
