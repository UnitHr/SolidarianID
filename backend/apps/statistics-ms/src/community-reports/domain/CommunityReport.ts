import { ValueObject } from '@common-lib/common-lib/core/domain/ValueObject';
import { CommunityByCommunityId } from './CommunityByCommunityId';
import { ActionByCommunityId } from './ActionByCommunityId';
import { CauseByCommunityId } from './CauseByCommunityId';

interface CommunityReportProps {
  comunity: CommunityByCommunityId;
  causes: CauseByCommunityId[];
  actions: ActionByCommunityId[];
}

export class CommunityReport extends ValueObject<CommunityReportProps> {
  private constructor(props: CommunityReportProps) {
    super(props);
  }

  get community(): CommunityByCommunityId {
    return this.props.comunity;
  }

  get causes(): CauseByCommunityId[] {
    return this.props.causes;
  }

  get actions(): ActionByCommunityId[] {
    return this.props.actions;
  }

  public static create(
    comunity: CommunityByCommunityId,
    causes: CauseByCommunityId[],
    actions: ActionByCommunityId[],
  ): CommunityReport {
    return new CommunityReport({
      comunity,
      causes,
      actions,
    });
  }
}
