import { ValueObject } from '@common-lib/common-lib/core/domain/ValueObject';
import { NegativeCountError } from '../exceptions';

interface CommunityStatisticsProps {
  communityId: string;
  communityName: string;
  supportCount: number;
  actionsTargetTotal: number;
  actionsAchievedTotal: number;
}

export class CommunityStatistics extends ValueObject<CommunityStatisticsProps> {
  private constructor(props: CommunityStatisticsProps) {
    super(props);
  }

  get communityId(): string {
    return this.props.communityId;
  }

  get communityName(): string {
    return this.props.communityName;
  }

  get supportCount(): number {
    return this.props.supportCount;
  }

  get actionsTargetTotal(): number {
    return this.props.actionsTargetTotal;
  }

  get actionsAchievedTotal(): number {
    return this.props.actionsAchievedTotal;
  }

  public static create(
    communityId: string,
    communityName: string,
    supportCount: number = 0,
    actionsTargetTotal: number = 0,
    actionsAchievedTotal: number = 0,
  ): CommunityStatistics {
    if (supportCount < 0) {
      throw new NegativeCountError(
        '[CommunityStatistics] Support count cannot be negative.',
      );
    }
    if (actionsTargetTotal < 0) {
      throw new NegativeCountError(
        '[CommunityStatistics] Actions target total cannot be negative.',
      );
    }
    if (actionsAchievedTotal < 0) {
      throw new NegativeCountError(
        '[CommunityStatistics] Actions achieved total cannot be negative.',
      );
    }

    return new CommunityStatistics({
      communityId,
      communityName,
      supportCount,
      actionsTargetTotal,
      actionsAchievedTotal,
    });
  }

  public incrementSupportCount(amount: number = 1): number {
    this.props.supportCount += amount;
    return this.props.supportCount;
  }

  public incrementActionsTargetTotal(amount: number): number {
    this.props.actionsTargetTotal += amount;
    return this.props.actionsTargetTotal;
  }

  public incrementActionsAchievedTotal(amount: number): number {
    this.props.actionsAchievedTotal += amount;
    return this.props.actionsAchievedTotal;
  }
}
