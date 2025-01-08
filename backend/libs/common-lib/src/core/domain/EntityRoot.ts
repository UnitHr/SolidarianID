import { AggregateRoot } from '@nestjs/cqrs';
import { UniqueEntityID } from './UniqueEntityID';

export abstract class EntityRoot<T> extends AggregateRoot {
  protected readonly _id: UniqueEntityID;

  protected readonly props: T;

  constructor(props: T, id?: UniqueEntityID) {
    super();
    this._id = id || new UniqueEntityID();
    this.props = props;
  }

  public equals(object?: EntityRoot<T>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!EntityRoot.isEntityRoot(object)) {
      return false;
    }

    return this._id.equals(object._id);
  }

  public static isEntityRoot(v: unknown): v is EntityRoot<unknown> {
    return v instanceof EntityRoot;
  }
}
