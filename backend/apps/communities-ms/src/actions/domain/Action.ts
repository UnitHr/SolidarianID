import {
  Entity,
  UniqueEntityID,
} from '@common-lib/common-lib/core/domain/Entity';

export interface ActionProps {
  id: string;
  status?: 'pending' | 'in_progress' | 'completed';
  title: string;
  description: string;
  causeId: string;
}

export abstract class Action extends Entity<ActionProps> {
  protected constructor(props: ActionProps, id?: UniqueEntityID) {
    super(props, id);
    this.props.status = props.status || 'pending';
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

  get causeId(): string {
    return this.props.causeId;
  }

  get status(): 'pending' | 'in_progress' | 'completed' {
    return this.props.status;
  }

  public abstract create(props: ActionProps): Action;

  updateCommonProperties(params: ActionProps): void {
    if (params.title !== undefined) this.props.title = params.title as string;
    if (params.description)
      this.props.description = params.description as string;
  }

  abstract update(params: ActionProps): void;

  abstract getType(): string;

  abstract getSummary(): string;
}
