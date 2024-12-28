import { DomainError } from '@common-lib/common-lib/core/exceptions/DomainError';
import { Result } from '@common-lib/common-lib/core/logic/Result';

export class CommentIsMandatory extends Result<DomainError> {
  private constructor() {
    super(false, {
      message: `The comment is mandatory when the request is denied`,
    });
  }

  public static create(): CommentIsMandatory {
    return new CommentIsMandatory();
  }
}
