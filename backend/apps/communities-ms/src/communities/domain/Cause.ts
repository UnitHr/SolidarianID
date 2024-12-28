import {
  Entity,
  UniqueEntityID,
} from '@common-lib/common-lib/core/domain/Entity';
import { Ods } from './Ods';

export interface CauseProps {
  title: string;
  description: string;
  ods: Ods[];
}

// TODO: Review if Entity<T> is needed
export class Cause extends Entity<CauseProps> {
  private constructor(props: CauseProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get ods(): Ods[] {
    return this.props.ods;
  }

  public static create(props: CauseProps, id?: UniqueEntityID): Cause {
    return new Cause(props, id);
  }
}
