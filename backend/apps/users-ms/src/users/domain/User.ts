import { UniqueEntityID } from '@common-lib/common-lib/core/domain/Entity';
import { EntityRoot } from '@common-lib/common-lib/core/domain/EntityRoot';
import { UserBirthDate } from './UserBirthDate';
import { UserPassword } from './Password';
import { MissingPropertiesError } from '../exceptions';
import { UserEmail } from './UserEmail';

export interface UserProps {
  firstName: string;
  lastName: string;
  birthDate: UserBirthDate;
  email: UserEmail;
  password: UserPassword;
  bio?: string;
  showAge: boolean;
  showEmail: boolean;
  role: string;
  githubId?: string;
}

export class User extends EntityRoot<UserProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get birthDate(): UserBirthDate {
    return this.props.birthDate;
  }

  get email(): string {
    return this.props.email.value;
  }

  set email(email: string) {
    this.props.email = UserEmail.create(email);
  }

  get password(): string {
    return this.props.password.value;
  }

  set password(password: UserPassword) {
    this.props.password = password;
  }

  get userPassword(): UserPassword {
    return this.props.password;
  }

  get bio(): string {
    return this.props.bio ?? 'No bio available';
  }

  set bio(bio: string) {
    this.props.bio = bio;
  }

  get showAge(): boolean {
    return this.props.showAge;
  }

  get showEmail(): boolean {
    return this.props.showEmail;
  }

  get role(): string {
    return this.props.role;
  }

  set role(role: string) {
    this.props.role = role;
  }

  get age(): number {
    return this.birthDate.age;
  }

  get githubId(): string {
    return this.props.githubId;
  }

  set githubId(githubId: string) {
    this.props.githubId = githubId;
  }

  public static create(props: UserProps, id?: UniqueEntityID): User {
    const { firstName, lastName, birthDate, email, password } = props;
    if (!firstName || !lastName || !birthDate || !email || !password) {
      throw new MissingPropertiesError(
        '[User] Missing properties to create a new user.',
      );
    }

    return new User(props, id);
  }

  public updateProfile({ email, bio }: { email?: string; bio?: string }): void {
    if (email && email !== this.email) {
      this.props.email = UserEmail.create(email);
    }

    if (bio !== undefined) {
      this.props.bio = bio.trim() || 'No bio available';
    }
  }

  public async isValidPassword(password: string): Promise<boolean> {
    return this.props.password.compare(password);
  }
}
