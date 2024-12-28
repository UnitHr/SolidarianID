import * as Domain from './domain';
import { CauseDto } from './dto/cause.dto';
import * as Persistence from './infra/persistence';

export class CauseMapper {
  static toDomain(document: Persistence.Cause): Domain.Cause {
    const { id, title, description, communityId, ods } = document;
    return Domain.Cause.create({ title, description, communityId, ods }, id);
  }

  static toPersistence(cause: Domain.Cause): Persistence.Cause {
    return {
      id: cause.id.toString(),
      title: cause.title,
      description: cause.description,
      communityId: cause.communityId,
      ods: cause.ods,
    };
  }

  static toDTO(cause: Domain.Cause): CauseDto {
    return {
      id: cause.id.toString(),
      title: cause.title,
      description: cause.description,
      communityId: cause.communityId,
    };
  }
}
