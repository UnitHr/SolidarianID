import { UniqueEntityID } from '@common-lib/common-lib/core/domain/Entity';
import { EntityRoot } from '@common-lib/common-lib/core/domain/EntityRoot';
import { CommunityCreatedEvent } from '@common-lib/common-lib/events/domain/CommunityCreatedEvent';
import { UserJoinedCommunity } from '@common-lib/common-lib/events/domain/UserJoinedCommunity';
import { MissingPropertiesError } from '../exceptions';

interface CommunityProps {
  adminId: string;
  name: string;
  description: string;
  members: string[];
  causes: string[];
}

export class Community extends EntityRoot<CommunityProps> {
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
    const { adminId, name, description, members, causes } = props;
    if (!adminId || !name || !description || !members || !causes) {
      MissingPropertiesError.create();
    }
    const community = new Community(props, id);
    if (!id) {
      community.apply(
        new CommunityCreatedEvent(
          adminId,
          community.id.toString(),
          name,
          name,
          description,
        ),
      );
    }
    return community;
  }

  addMember(memberId: string): void {
    this.props.members.push(memberId);
    this.apply(
      new UserJoinedCommunity(memberId, this.id.toString(), this.name),
    );
  }

  addCause(causeId: string): void {
    this.props.causes.push(causeId);
  }
}
