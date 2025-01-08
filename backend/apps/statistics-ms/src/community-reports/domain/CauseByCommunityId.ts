import { NegativeCountError } from '@common-lib/common-lib/core/exceptions/negative-count.error';
import { ValueObject } from '@common-lib/common-lib/core/domain/ValueObject';
import { ActionByCauseId } from './ActionByCauseId';

interface CauseByCommunityIdProps {
  communityId: string;
  causeId: string;
  causeName: string;
  supportsCount: number;
  ods: Set<number>;
  actions: ActionByCauseId[];
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

  get actions(): ActionByCauseId[] {
    return this.props.actions;
  }

  public static create(
    communityId: string,
    causeId: string,
    causeName: string,
    supportsCount: number = 0,
    ods: Set<number> = new Set(),
    actions: ActionByCauseId[] = [],
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
      actions,
    });
  }

  public incrementSupportsCount(amount: number = 1): number {
    this.props.supportsCount += amount;
    return this.props.supportsCount;
  }

  public addOds(odsId: number): void {
    this.props.ods.add(odsId);
  }

  public addActions(actions: ActionByCauseId | ActionByCauseId[]): void {
    if (Array.isArray(actions)) {
      this.props.actions.push(...actions);
    } else {
      this.props.actions.push(actions);
    }
  }
}
