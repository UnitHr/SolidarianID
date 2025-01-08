import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import * as Domain from '../domain';
import * as Persistence from '../infra/persistence';
import { CommunityDto } from '../dto/community.dto';

export class CommunityMapper {
  static toDomain(raw: Persistence.Community): Domain.Community {
    return Domain.Community.create(
      {
        adminId: raw.adminId,
        name: raw.name,
        description: raw.description,
        members: raw.members,
        causes: raw.causes,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(entity: Domain.Community): Persistence.Community {
    return {
      id: entity.id.toString(),
      adminId: entity.adminId,
      name: entity.name,
      description: entity.description,
      members: entity.members,
      causes: entity.causes,
    };
  }

  static toDto(entity: Domain.Community): CommunityDto {
    return {
      id: entity.id.toString(),
      adminId: entity.adminId,
      name: entity.name,
      description: entity.description,
    };
  }
}
