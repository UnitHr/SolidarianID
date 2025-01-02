import { ValueObject } from '@common-lib/common-lib/core/domain/ValueObject';
import { Utils } from '@common-lib/common-lib/common/utils';
import { AGE_OF_MAJORITY } from '@common-lib/common-lib/common/constant';
import { InvalidDateProvidedError } from '@common-lib/common-lib/core/exceptions';
import { UnderageUserError } from '../exceptions/under-age-user.error';

interface UserBirthDateProps {
  value: Date;
}

export class UserBirthDate extends ValueObject<UserBirthDateProps> {
  private constructor(props: UserBirthDateProps) {
    super(props);
  }

  get value(): Date {
    return this.props.value;
  }

  get age(): number {
    return Utils.calculateAge(this.value);
  }

  public static create(value: Date): UserBirthDate {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new InvalidDateProvidedError();
    }
    if (Utils.calculateAge(value) < AGE_OF_MAJORITY) {
      throw new UnderageUserError(AGE_OF_MAJORITY);
    }
    return new UserBirthDate({ value });
  }
}
