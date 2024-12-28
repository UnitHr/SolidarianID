import { ValueObject } from '@common-lib/common-lib/core/domain/ValueObject';
import { Result } from '@common-lib/common-lib/core/logic/Result';

interface CauseEndDateProps {
  value: Date;
}

export class CauseEndDate extends ValueObject<CauseEndDateProps> {
  get value(): Date {
    return this.props.value;
  }

  private constructor(props: CauseEndDateProps) {
    super(props);
  }

  public static create(end: Date): Result<CauseEndDate> {
    const now = new Date();
    if (end <= now) {
      return Result.fail<CauseEndDate>(
        'The end of the cause must be superior to the current date',
      );
    }
    return Result.ok<CauseEndDate>(new CauseEndDate({ value: end }));
  }
}
