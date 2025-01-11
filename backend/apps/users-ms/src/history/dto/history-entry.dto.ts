// TODO: Rename file
export class HistoryEntryDto {
  type: string;

  entityId: string;

  timestamp: Date;

  status?: string;

  metadata?: Record<string, unknown>;
}
