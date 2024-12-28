import { InvalidPasswordError } from '../exceptions/invalid-password.error';

interface UserpasswordProps {
  password: string;
}

export class UserPassword {
  private constructor(private props: UserpasswordProps) {}

  get password(): string {
    return this.props.password;
  }

  public static create(password: string): UserPassword {
    const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!pattern.test(password)) {
      throw new InvalidPasswordError();
    }
    return new UserPassword({ password });
  }
}
