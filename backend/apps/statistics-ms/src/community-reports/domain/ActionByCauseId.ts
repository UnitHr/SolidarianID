import { Entity } from '@common-lib/common-lib/core/domain/Entity';
import { NegativeCountError } from '@common-lib/common-lib/core/exceptions/negative-count.error';

interface ActionByCauseIdProps {
  causeId: string;
  actionId: string;
  actionName: string;
  target: number;
  achieved: number;
}

export class ActionByCauseId extends Entity<ActionByCauseIdProps> {
  private constructor(props: ActionByCauseIdProps) {
    super(props);
  }

  get causeId(): string {
    return this.props.causeId;
  }

  get actionId(): string {
    return this.props.actionId;
  }

  get actionName(): string {
    return this.props.actionName;
  }

  get target(): number {
    return this.props.target;
  }

  get achieved(): number {
    return this.props.achieved;
  }

  set achieved(achieved: number) {
    this.props.achieved = achieved;
  }

  public static create(
    causeId: string,
    actionId: string,
    actionName: string,
    target: number = 0,
    achieved: number = 0,
  ): ActionByCauseId {
    if (target < 0) {
      throw new NegativeCountError(
        '[ActionByCauseId] Target value cannot be negative.',
      );
    }
    if (achieved < 0) {
      throw new NegativeCountError(
        '[ActionByCauseId] Achieved value cannot be negative.',
      );
    }

    return new ActionByCauseId({
      causeId,
      actionId,
      actionName,
      target,
      achieved,
    });
  }

  public incrementAchieved(amount: number = 1): number {
    if (amount < 0) {
      throw new NegativeCountError(
        '[ActionByCauseId] Increment amount cannot be negative.',
      );
    }
    this.achieved += amount;
    return this.achieved;
  }
}
