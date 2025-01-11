import { IsOptional, IsEnum } from 'class-validator';
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination.dto';
import { ActivityType } from '../domain/ActivityType';
import { EntryStatus } from '../domain/HistoryEntryStatus';

export class FindHistoryDto extends QueryPaginationDto {
  @IsOptional()
  @IsEnum(ActivityType)
  type?: ActivityType;

  @IsOptional()
  @IsEnum(EntryStatus)
  status?: EntryStatus;
}
