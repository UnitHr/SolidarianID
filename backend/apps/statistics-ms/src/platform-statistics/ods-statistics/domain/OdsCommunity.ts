import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { Entity } from '@common-lib/common-lib/core/domain/Entity';
import { MissingPropertiesError } from '@common-lib/common-lib/core/exceptions/missing-properties.error';

interface OdsCommunityProps {
  odsId: ODSEnum;
  communityId: string;
}

export class OdsCommunity extends Entity<OdsCommunityProps> {
  private constructor(props: OdsCommunityProps) {
    super(props);
  }

  get odsId(): ODSEnum {
    return this.props.odsId;
  }

  get communityId(): string {
    return this.props.communityId;
  }

  public static create(odsId: ODSEnum, communityId: string): OdsCommunity {
    if (!odsId || !communityId) {
      throw new MissingPropertiesError(
        '[OdsCommunity] OdsId and communityId are required.',
      );
    }
    return new OdsCommunity({ odsId, communityId });
  }
}
