import { ValueObject } from '@common-lib/common-lib/core/domain/ValueObject';
import { InvalidDateProvidedError } from '@common-lib/common-lib/core/exceptions/invalid-date-provided.error';

interface CauseEndDateProps {
  value: Date;
}

export class CauseEndDate extends ValueObject<CauseEndDateProps> {
  private constructor(props: CauseEndDateProps) {
    super(props);
  }

  get value(): Date {
    return this.props.value;
  }

  public static create(value: Date): CauseEndDate {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new InvalidDateProvidedError();
    }

    if (value <= new Date()) {
      throw new InvalidDateProvidedError('The end date must be in the future.');
    }
    return new CauseEndDate({ value });
  }
}
