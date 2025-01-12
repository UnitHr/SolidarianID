import { ValueObject } from '@common-lib/common-lib/core/domain/ValueObject';
import { InvalidEmailError } from '../exceptions/invalid-email.error';

interface UserEmailProps {
  value: string;
}

export class UserEmail extends ValueObject<UserEmailProps> {
  private static EMAIL_REGEX =
    /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  get value(): string {
    return this.props.value;
  }

  private static validate(email: string): void {
    if (!UserEmail.EMAIL_REGEX.test(email)) {
      throw new InvalidEmailError(email);
    }
  }

  public static create(email: string): UserEmail {
    UserEmail.validate(email);
    return new UserEmail({ value: email.toLowerCase() });
  }
}
