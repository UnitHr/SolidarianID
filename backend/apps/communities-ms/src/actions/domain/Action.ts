import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { EntityRoot } from '@common-lib/common-lib/core/domain/EntityRoot';
import { ActionContributedEvent } from '@common-lib/common-lib/events/domain/ActionContributedEvent';
import { ActionStatus } from './ActionStatus';
import { ActionType } from './ActionType';
import { Contribution } from './Contribution';
import * as Exceptions from '../exceptions';

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
  createdBy: string;
  communityId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class Action extends EntityRoot<ActionProps> {
  protected constructor(props: ActionProps, id?: UniqueEntityID) {
    super(props, id);
    this.props.status = props.status || ActionStatus.PENDING;
    this.props.contributions = props.contributions || [];
    this.props.achieved = props.achieved ?? 0;
    this.props.createdAt = props.createdAt ?? new Date();
    this.props.updatedAt = props.updatedAt ?? new Date();
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
    return [...this.props.contributions];
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

  get createdBy(): string {
    return this.props.createdBy;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get communityId(): string {
    return this.props.communityId;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  addContribution(contribution: Contribution) {
    this.props.contributions.push(contribution);
  }

  update(title?: string, description?: string, target?: number): void {
    if (title !== undefined) {
      this.props.title = title;
    }
    if (description !== undefined) {
      this.props.description = description;
    }
    if (target !== undefined) {
      this.props.target = target;
    }
  }

  getProgress(): number {
    return (this.achieved / this.target) * 100;
  }

  contribute(userId: string, date: Date, amount: number, unit: string): string {
    const actionId = this.id.toString();
    this.validateContribution(actionId, unit);

    const contribution = this.createContribution(
      userId,
      actionId,
      date,
      amount,
      unit,
    );
    this.processContribution(contribution);
    this.publishContributionEvent(contribution, actionId);
    return contribution.id.toString();
  }

  private validateContribution(actionId: string, unit: string): void {
    if (this.unit !== unit) {
      throw new Exceptions.InvalidContributionUnitError(
        actionId,
        unit,
        this.unit,
      );
    }

    if (this.status === ActionStatus.COMPLETED) {
      throw new Exceptions.CompletedActionError(actionId);
    }
  }

  private createContribution(
    userId: string,
    actionId: string,
    date: Date,
    amount: number,
    unit: string,
  ): Contribution {
    return Contribution.create({
      userId,
      actionId,
      date,
      amount,
      unit,
    });
  }

  private processContribution(contribution: Contribution): void {
    if (this.status === ActionStatus.PENDING) {
      this.status = ActionStatus.IN_PROGRESS;
    }

    this.addContribution(contribution);
    this.achieved += contribution.amount;

    if (this.achieved >= this.target) {
      this.status = ActionStatus.COMPLETED;
    }
  }

  private publishContributionEvent(
    contribution: Contribution,
    actionId: string,
  ): void {
    this.apply(
      new ActionContributedEvent(
        contribution.userId,
        this.communityId,
        actionId,
        this.title,
        this.causeId,
        contribution.amount,
        contribution.unit,
      ),
    );
  }

  static checkProperties(props: ActionProps): boolean {
    const { type, title, description, causeId, createdBy } = props;
    if (!type || !title || !description || !causeId || !createdBy) {
      return false;
    }
    return true;
  }
}
