import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { Entity } from '@common-lib/common-lib/core/domain/Entity';
import { NegativeCountError } from '@common-lib/common-lib/core/exceptions/negative-count.error';

interface OdsStatisticsProps {
  odsId: ODSEnum;
  communitiesCount: number;
  causesCount: number;
  supportsCount: number;
}

export class OdsStatistics extends Entity<OdsStatisticsProps> {
  private constructor(props: OdsStatisticsProps) {
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

  get supportsCount(): number {
    return this.props.supportsCount;
  }

  public static create(
    odsId: ODSEnum,
    communitiesCount: number = 0,
    causesCount: number = 0,
    supportsCount: number = 0,
  ): OdsStatistics {
    if (communitiesCount < 0) {
      throw new NegativeCountError(
        '[OdsStatistics] Communities count cannot be negative.',
      );
    }
    if (causesCount < 0) {
      throw new NegativeCountError(
        '[OdsStatistics] Causes count cannot be negative.',
      );
    }
    if (supportsCount < 0) {
      throw new NegativeCountError(
        '[OdsStatistics] Supports count cannot be negative.',
      );
    }

    return new OdsStatistics({
      odsId,
      communitiesCount,
      causesCount,
      supportsCount,
    });
  }

  public incrementCommunitiesCount(amount: number = 1): number {
    this.props.communitiesCount += amount;
    return this.props.communitiesCount;
  }

  public incrementCausesCount(amount: number = 1): number {
    this.props.causesCount += amount;
    return this.props.causesCount;
  }

  public incrementSupportsCount(amount: number = 1): number {
    this.props.supportsCount += amount;
    return this.props.supportsCount;
  }
}
