import {
  Entity,
  UniqueEntityID,
} from '@common-lib/common-lib/core/domain/Entity';

interface CommunityProps {
  adminId: string;
  name: string;
  description: string;
  members: string[];
  causes: string[];
}

export class Community extends Entity<CommunityProps> {
  private constructor(props: CommunityProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get adminId(): string {
    return this.props.adminId;
  }

  set adminId(value: string) {
    this.props.adminId = value;
  }

  get members(): string[] {
    return this.props.members;
  }

  set members(value: string[]) {
    this.props.members = value;
  }

  get causes(): string[] {
    return this.props.causes;
  }

  set causes(value: string[]) {
    this.props.causes = value;
  }

  static create(props: CommunityProps, id?: UniqueEntityID): Community {
    return new Community(props, id);
  }
}
