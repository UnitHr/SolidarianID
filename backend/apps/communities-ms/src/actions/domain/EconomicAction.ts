import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { Action, ActionProps } from './Action';

export interface EconomicActionProps extends ActionProps {
  targetAmount: number;
  currentAmount: number;
}

export class EconomicAction extends Action {
  constructor(props: EconomicActionProps) {
    super(props, new UniqueEntityID(props.id));
  }

  get targetAmount(): number {
    return (this.props as EconomicActionProps).targetAmount;
  }

  set targetAmount(value: number) {
    (this.props as EconomicActionProps).targetAmount = value;
  }

  get currentAmount(): number {
    return (this.props as EconomicActionProps).currentAmount;
  }

  set currentAmount(value: number) {
    (this.props as EconomicActionProps).currentAmount = value;
  }

  update(params: EconomicActionProps): void {
    this.updateCommonProperties(params);
    if (params.targetAmount !== undefined) {
      this.targetAmount = params.targetAmount;
    }
    if (params.currentAmount !== undefined) {
      this.currentAmount = params.currentAmount;
    }
  }

  getProgress(): number {
    return (this.currentAmount / this.targetAmount) * 100;
  }

  // eslint-disable-next-line class-methods-use-this
  getType(): string {
    return 'economic';
  }

  getSummary(): string {
    return `We need to raise $${this.targetAmount} for ${this.title}. So far we have raised $${this.currentAmount}.`;
  }

  /* eslint-disable class-methods-use-this */
  create(props: EconomicActionProps): Action {
    return new EconomicAction(props);
  }
}
