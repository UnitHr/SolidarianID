import { EntityRoot } from '@common-lib/common-lib/core/domain/EntityRoot';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { HistoryEntry } from './HistoryEntry';
import { HistoryEntryType } from './HistoryEntryType';

interface HistoryProps {
  userId: UniqueEntityID;
  entries: HistoryEntry[];
}

export class History extends EntityRoot<HistoryProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get userId(): UniqueEntityID {
    return this.props.userId;
  }

  get entries(): readonly HistoryEntry[] {
    return Object.freeze([...this.props.entries]);
  }

  public static create(props: HistoryProps, id?: UniqueEntityID): History {
    return new History(props, id);
  }

  // TODO: maybe we could launch notifications via events here
  public addEntry(entry: HistoryEntry): void {
    this.props.entries.push(entry);
  }

  public getEntriesByType(type: HistoryEntryType): HistoryEntry[] {
    return this.props.entries.filter((entry) => entry.type === type);
  }

  public addEntryUserFollowed(followedUserId: string): void {
    const entry = HistoryEntry.create({
      type: HistoryEntryType.USER_FOLLOWED,
      entityId: new UniqueEntityID(followedUserId),
      timestamp: new Date(),
    });

    this.addEntry(entry);
  }

  public addEntryActionContribute(actionId: string): void {
    const entry = HistoryEntry.create({
      type: HistoryEntryType.ACTION_CONTRIBUTION,
      entityId: new UniqueEntityID(actionId),
      timestamp: new Date(),
    });

    this.addEntry(entry);
  }
}
