import { ODSEnum } from '@common-lib/common-lib/common/ods';
import * as Domain from '../domain';

export abstract class CommunityReportsService {
  abstract findCommunityReport(
    communityId: string,
  ): Promise<Domain.CommunityByCommunityId>;

  abstract registerCommunityCreation(
    communityId: string,
    communityName: string,
    adminId: string,
  ): Promise<void>;

  abstract registerCommunityJoinMember(communityId: string): Promise<void>;

  abstract registerCauseCreation(
    communityId: string,
    causeId: string,
    causeName: string,
    ods: ODSEnum,
  ): Promise<void>;

  abstract registerCauseAddSupporter(causeId: string): Promise<void>;

  abstract registerActionCreation(
    causeId: string,
    actionId: string,
    actionName: string,
    target: number,
  ): Promise<void>;

  abstract registerActionContributed(
    actionId: string,
    amount: number,
  ): Promise<void>;
}
