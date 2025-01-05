import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { ValueObject } from '@common-lib/common-lib/core/domain/ValueObject';
import { NegativeCountError } from '../exceptions';

interface CommunitiesCausesByOdsProps {
  odsId: ODSEnum;
  communitiesCount: number;
  causesCount: number;
}

export class CommunitiesCausesByOds extends ValueObject<CommunitiesCausesByOdsProps> {
  private constructor(props: CommunitiesCausesByOdsProps) {
    super(props);
  }

  get odsId(): ODSEnum {
    return this.props.odsId;
  }

  get communitiesCount(): number {
    return this.props.communitiesCount;
  }

  get causesCount(): number {
    return this.props.causesCount;
  }

  public static create(
    odsId: ODSEnum,
    communitiesCount: number = 0,
    causesCount: number = 0,
  ): CommunitiesCausesByOds {
    if (communitiesCount < 0) {
      throw new NegativeCountError(
        '[CommunitiesCausesByOds] Communities count cannot be negative.',
      );
    }
    if (causesCount < 0) {
      throw new NegativeCountError(
        '[CommunitiesCausesByOds] Causes count cannot be negative.',
      );
    }

    return new CommunitiesCausesByOds({ odsId, communitiesCount, causesCount });
  }

  public incrementCommunitiesCount(amount: number = 1): number {
    this.props.communitiesCount += amount;
    return this.props.communitiesCount;
  }

  public incrementCausesCount(amount: number = 1): number {
    this.props.causesCount += amount;
    return this.props.causesCount;
  }
}
