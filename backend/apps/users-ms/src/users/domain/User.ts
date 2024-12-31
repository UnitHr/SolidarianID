import {
  Entity,
  UniqueEntityID,
} from '@common-lib/common-lib/core/domain/Entity';
import { UserBirthDate } from './UserBirthDate';
import { MissingUserPropertiesError } from '../exceptions/missing-user-properties.error';
import { UserPassword } from './Password';

export interface UserProps {
  firstName: string;
  lastName: string;
  birthDate: UserBirthDate;
  email: string;
  password: UserPassword;
  bio?: string;
  showAge: boolean;
  showEmail: boolean;
  role: string;
}

export class User extends Entity<UserProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get birthDate(): UserBirthDate {
    return this.props.birthDate;
  }

  get email(): string {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
  }

  get password(): string {
    return this.props.password.value;
  }

  set password(password: UserPassword) {
    this.props.password = password;
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

  public static create(props: UserProps, id?: UniqueEntityID): User {
    const { firstName, lastName, birthDate, email, password } = props;
    if (!firstName || !lastName || !birthDate || !email || !password) {
      throw new MissingUserPropertiesError();
    }
    return new User(props, id);
  }

  public updateProfile(updateData: Partial<UserProps>): void {
    if (updateData.email && updateData.email !== this.props.email) {
      this.props.email = updateData.email;
    }

    if (updateData.bio !== undefined) {
      this.props.bio = updateData.bio.trim() || 'No bio available';
    }
  }

  public async isValidPassword(password: string): Promise<boolean> {
    return this.props.password.compare(password);
  }
}
