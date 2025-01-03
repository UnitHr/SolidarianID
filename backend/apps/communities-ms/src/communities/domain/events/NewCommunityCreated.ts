import { ODSEnum } from '@common-lib/common-lib/common/ods';

export class NewCommunityCreated {
  public readonly instance: Date = new Date();

  constructor(
    public readonly causeTitle: string,
    public readonly causeDescription: string,
    public readonly causeEndDate: Date,
    public readonly causeOds: ODSEnum[],
  ) {}
}
