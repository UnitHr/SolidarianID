import { ODSEnum } from '@common-lib/common-lib/common/ods';
import * as Persistence from '../infra/persistence';
import * as Domain from '../domain';

export class OdsCommunityMapper {
  static toDomain(raw: Persistence.OdsCommunity): Domain.OdsCommunity {
    const odsCommunity = Domain.OdsCommunity.create(
      raw.odsId as ODSEnum,
      raw.communityId,
    );
    return odsCommunity;
  }

  static toPersistence(entity: Domain.OdsCommunity): Persistence.OdsCommunity {
    return {
      odsId: entity.odsId as number,
      communityId: entity.communityId,
    };
  }
}
