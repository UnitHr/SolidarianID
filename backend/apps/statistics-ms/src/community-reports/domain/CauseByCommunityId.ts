import { ValueObject } from '@common-lib/common-lib/core/domain/ValueObject';
import { NegativeCountError } from '@common-lib/common-lib/core/exceptions/negative-count.error';

interface CauseByCommunityIdProps {
  communityId: string;
  causeId: string;
  causeName: string;
  supportsCount: number;
  ods: Set<number>;
}

export class CauseByCommunityId extends ValueObject<CauseByCommunityIdProps> {
  private constructor(props: CauseByCommunityIdProps) {
    super(props);
  }

  get communityId(): string {
    return this.props.communityId;
  }

  get causeId(): string {
    return this.props.causeId;
  }

  get causeName(): string {
    return this.props.causeName;
  }

  get supportsCount(): number {
    return this.props.supportsCount;
  }

  get ods(): Set<number> {
    return this.props.ods;
  }

  public static create(
    communityId: string,
    causeId: string,
    causeName: string,
    supportsCount: number = 0,
    ods: Set<number> = new Set(),
  ): CauseByCommunityId {
    if (supportsCount < 0) {
      throw new NegativeCountError(
        '[CauseByCommunityId] Supports count cannot be negative.',
      );
    }

    return new CauseByCommunityId({
      communityId,
      causeId,
      causeName,
      supportsCount,
      ods,
    });
  }

  public incrementSupportsCount(amount: number = 1): number {
    this.props.supportsCount += amount;
    return this.props.supportsCount;
  }

  public addOds(odsId: number): void {
    this.props.ods.add(odsId);
  }
}
