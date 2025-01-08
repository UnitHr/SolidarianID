import { ValueObject } from '@common-lib/common-lib/core/domain/ValueObject';
import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { NegativeCountError } from '@common-lib/common-lib/core/exceptions/negative-count.error';

interface CommunityByCommunityIdProps {
  communityId: string;
  communityName: string;
  adminId: string;
  membersCount: number;
  ods: Set<ODSEnum>;
}

export class CommunityByCommunityId extends ValueObject<CommunityByCommunityIdProps> {
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

  get ods(): Set<ODSEnum> {
    return this.props.ods;
  }

  public static create(
    communityId: string,
    communityName: string,
    adminId: string,
    membersCount: number = 0,
    ods: Set<ODSEnum> = new Set<ODSEnum>(),
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
    });
  }

  public incrementMembersCount(amount: number = 1): number {
    this.props.membersCount += amount;
    return this.props.membersCount;
  }

  public addODS(ods: ODSEnum): void {
    this.props.ods.add(ods);
  }
}
