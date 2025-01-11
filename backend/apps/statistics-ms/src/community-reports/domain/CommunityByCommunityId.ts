import { NegativeCountError } from '@common-lib/common-lib/core/exceptions/negative-count.error';
import { Entity } from '@common-lib/common-lib/core/domain/Entity';
import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { CauseByCommunityId } from './CauseByCommunityId';

interface CommunityByCommunityIdProps {
  communityId: string;
  communityName: string;
  adminId: string;
  membersCount: number;
  ods: Set<ODSEnum>;
  causes: CauseByCommunityId[];
}

export class CommunityByCommunityId extends Entity<CommunityByCommunityIdProps> {
  private constructor(props: CommunityByCommunityIdProps) {
    super(props);
  }

  get communityId(): string {
    return this.props.communityId;
  }

  get communityName(): string {
    return this.props.communityName;
  }

  get adminId(): string {
    return this.props.adminId;
  }

  get membersCount(): number {
    return this.props.membersCount;
  }

  set membersCount(membersCount: number) {
    this.props.membersCount = membersCount;
  }

  get ods(): Set<ODSEnum> {
    return this.props.ods;
  }

  get causes(): CauseByCommunityId[] {
    return this.props.causes;
  }

  public static create(
    communityId: string,
    communityName: string,
    adminId: string,
    membersCount: number = 1,
    ods: Set<ODSEnum> = new Set<ODSEnum>(),
    causes: CauseByCommunityId[] = [],
  ): CommunityByCommunityId {
    if (membersCount < 0) {
      throw new NegativeCountError(
        '[CommunityByCommunityId] Members count cannot be negative.',
      );
    }

    return new CommunityByCommunityId({
      communityId,
      communityName,
      adminId,
      membersCount,
      ods,
      causes,
    });
  }

  public incrementMembersCount(amount: number = 1): number {
    this.membersCount += amount;
    return this.membersCount;
  }

  public addOds(ods: ODSEnum | Set<ODSEnum>): void {
    if (ods instanceof Set) {
      ods.forEach((item) => this.ods.add(item));
    } else {
      this.ods.add(ods);
    }
  }

  public addCauses(causes: CauseByCommunityId | CauseByCommunityId[]): void {
    if (Array.isArray(causes)) {
      this.causes.push(...causes);
    } else {
      this.causes.push(causes);
    }
  }
}
