import { IsOptional, IsEnum } from 'class-validator';
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination.dto';
import { HistoryEntryType } from '../domain/HistoryEntryType';
import { EntryStatus } from '../domain/HistoryEntryStatus';

export class FindHistoryDto extends QueryPaginationDto {
  @IsOptional()
  @IsEnum(HistoryEntryType)
  type?: HistoryEntryType;

  @IsOptional()
  @IsEnum(EntryStatus)
  status?: EntryStatus;
}
