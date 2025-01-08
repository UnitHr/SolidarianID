import { CommunityByCommunityIdResponseDto } from '../dto/community-report-response.dto';
import { mapODSEnumListToDetails } from '@common-lib/common-lib/common/ods';
import * as Domain from '../domain';

export class CommunityReportMapper {
  static toPersistence(
    entity: Domain.CommunityReport,
  ): CommunityByCommunityIdResponseDto {
    return {
      communityId: entity.community.communityId,
      communityName: entity.community.communityName,
      adminId: entity.community.adminId,
      members: entity.community.membersCount,
      ods: mapODSEnumListToDetails(Array.from(entity.community.ods)),
    };
  }
}
