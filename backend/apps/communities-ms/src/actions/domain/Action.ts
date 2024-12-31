import {
  Entity,
  UniqueEntityID,
} from '@common-lib/common-lib/core/domain/Entity';
import { Contribution } from './contributions/Contribution';

export interface ActionProps {
  status?: 'pending' | 'in_progress' | 'completed';
  title: string;
  description: string;
  causeId: string;
  contributions?: Contribution[];
}

export abstract class Action extends Entity<ActionProps> {
  protected constructor(props: ActionProps, id?: UniqueEntityID) {
    super(props, id);
    this.props.status = props.status || 'pending';
    if (this.props.contributions === undefined) this.props.contributions = [];

    if (this.props.contributions.length > 0)
      this.props.contributions = props.contributions;
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

  set status(value: 'pending' | 'in_progress' | 'completed') {
    this.props.status = value;
  }

  get contributions(): Contribution[] {
    return this.props.contributions;
  }

  addContribution(contribution: Contribution) {
    this.props.contributions.push(contribution);
  }

  // public abstract create(props: ActionProps, id?: string): Action;

  updateCommonProperties(params: ActionProps): void {
    if (params.title !== undefined) this.props.title = params.title as string;
    if (params.description)
      this.props.description = params.description as string;
  }

  abstract update(params: ActionProps): void;

  abstract getType(): string;

  abstract getSummary(): string;

  abstract contribute(contribution: Contribution): void;
}
