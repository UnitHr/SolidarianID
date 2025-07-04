import { NegativeCountError } from '@common-lib/common-lib/core/exceptions/negative-count.error';
import { Entity } from '@common-lib/common-lib/core/domain/Entity';
import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { ActionByCauseId } from './ActionByCauseId';

interface CauseByCommunityIdProps {
  communityId: string;
  causeId: string;
  causeName: string;
  ods: Set<ODSEnum>;
  supportsCount: number;
  actions: ActionByCauseId[];
}

export class CauseByCommunityId extends Entity<CauseByCommunityIdProps> {
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

  get ods(): Set<ODSEnum> {
    return this.props.ods;
  }

  get supportsCount(): number {
    return this.props.supportsCount;
  }

  set supportsCount(supportsCount: number) {
    this.props.supportsCount = supportsCount;
  }

  get actions(): ActionByCauseId[] {
    return this.props.actions;
  }

  public static create(
    communityId: string,
    causeId: string,
    causeName: string,
    ods: Set<ODSEnum> = new Set<ODSEnum>(),
    supportsCount: number = 0,
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
      ods,
      supportsCount,
      actions,
    });
  }

  public incrementSupportsCount(amount: number = 1): number {
    this.supportsCount += amount;
    return this.supportsCount;
  }

  public addODS(ods: ODSEnum | Set<ODSEnum>): void {
    if (ods instanceof Set) {
      ods.forEach((item) => this.ods.add(item));
    } else {
      this.ods.add(ods);
    }
  }

  public addActions(actions: ActionByCauseId | ActionByCauseId[]): void {
    if (Array.isArray(actions)) {
      this.actions.push(...actions);
    } else {
      this.actions.push(actions);
    }
  }
}
