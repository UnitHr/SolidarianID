import {
  Entity,
  UniqueEntityID,
} from '@common-lib/common-lib/core/domain/Entity';
import { ActionStatus } from './ActionStatus';
import { ActionType } from './ActionType';
import { Contribution } from './Contribution';

export interface ActionProps {
  type: ActionType;
  status?: ActionStatus;
  title: string;
  description: string;
  causeId: string;
  contributions?: Contribution[];
  target: number;
  unit: string;
  achieved?: number;
}

export abstract class Action extends Entity<ActionProps> {
  protected constructor(props: ActionProps, id?: UniqueEntityID) {
    super(props, id);
    this.props.status = props.status || ActionStatus.pending;
    this.props.achieved = props.achieved ?? 0;
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

  get type(): ActionType {
    return this.props.type;
  }

  set type(value: ActionType) {
    this.props.type = value;
  }

  get status(): ActionStatus {
    return this.props.status;
  }

  set status(value: ActionStatus) {
    this.props.status = value;
  }

  get contributions(): Contribution[] {
    return this.props.contributions;
  }

  get target(): number {
    return this.props.target;
  }

  get unit(): string {
    return this.props.unit;
  }

  set unit(value: string) {
    this.props.unit = value;
  }

  get achieved(): number {
    return this.props.achieved;
  }

  set achieved(value: number) {
    this.props.achieved = value;
  }

  addContribution(contribution: Contribution) {
    this.props.contributions.push(contribution);
  }

  updateCommonProperties(params: ActionProps): void {
    if (params.title !== undefined) this.props.title = params.title as string;
    if (params.description)
      this.props.description = params.description as string;
    if (params.achieved !== undefined) this.achieved = params.achieved;
  }

  abstract update(params: ActionProps): void;

  getProgress(): number {
    return (this.achieved / this.target) * 100;
  }

  contribute(contribution: Contribution): void {
    if (this.status === ActionStatus.pending)
      this.status = ActionStatus.in_progress;
    this.addContribution(contribution);

    this.achieved += contribution.amount;

    if (this.achieved >= this.target) this.status = ActionStatus.completed;
  }
}
