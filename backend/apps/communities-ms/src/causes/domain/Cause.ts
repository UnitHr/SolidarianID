import {
  Entity,
  UniqueEntityID,
} from '@common-lib/common-lib/core/domain/Entity';

export interface CauseProps {
  title: string;
  description: string;
  communityId: string;
  ods: number[];
}

export class Cause extends Entity<CauseProps> {
  protected constructor(props: CauseProps, id?: UniqueEntityID) {
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

  set description(description: string) {
    this.props.description = description;
  }

  get communityId(): string {
    return this.props.communityId;
  }

  get ods(): number[] {
    return this.props.ods;
  }

  set ods(ods: number[]) {
    this.props.ods = ods;
  }

  public static create(props: CauseProps, id?: string): Cause {
    if (id !== undefined) return new Cause(props, new UniqueEntityID(id));
    return new Cause(props);
  }
}
