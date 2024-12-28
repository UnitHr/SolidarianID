import * as Domain from './domain';
import { UserProfileDto } from './dto/user-profile.dto';
import * as Persistence from './infra/persistence';
import { UserBirthDate } from './domain/UserBirthDate';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';

export class UserMapper {
  static toDomain(raw: Persistence.User): Domain.User {
    return Domain.User.create(
      {
        ...raw,
        birthDate: UserBirthDate.create(new Date(raw.birthDate)),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPersistence(user: Domain.User): Persistence.User {
    return {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate.value,
      email: user.email,
      password: user.password,
      bio: user.bio,
      showAge: user.showAge,
      showEmail: user.showEmail,
      role: user.role,
    };
  }

  static toProfileDto(user: Domain.User): UserProfileDto {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.showAge ? user.age : undefined,
      email: user.showEmail ? user.email : undefined,
      bio: user.bio?.trim() ? user.bio : undefined,
    };
  }
}
