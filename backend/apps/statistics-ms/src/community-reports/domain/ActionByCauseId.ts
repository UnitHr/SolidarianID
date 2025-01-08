import { NegativeCountError } from '@common-lib/common-lib/core/exceptions/negative-count.error';
import { ValueObject } from '@common-lib/common-lib/core/domain/ValueObject';

interface ActionByCauseIdProps {
  causeId: string;
  actionId: string;
  actionName: string;
  target: number;
  achieved: number;
}

export class ActionByCauseId extends ValueObject<ActionByCauseIdProps> {
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
    this.props.achieved += amount;
    return this.props.achieved;
  }

  public setTarget(newTarget: number): void {
    if (newTarget < 0) {
      throw new NegativeCountError(
        '[ActionByCauseId] Target value cannot be negative.',
      );
    }
    this.props.target = newTarget;
  }
}
