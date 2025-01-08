import { HistoryEntryDto } from './HistoryEntryDto';

export class HistoryDto {
  userId: string;

  entries: HistoryEntryDto[];
}
