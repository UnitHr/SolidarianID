import { UniqueEntityID } from '@common-lib/common-lib/core/domain/Entity';

export abstract class AuthService {
  abstract signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }>;

  abstract signOauth2(
    userId: UniqueEntityID,
    email: string,
    role: string,
  ): Promise<{ access_token: string }>;
}
