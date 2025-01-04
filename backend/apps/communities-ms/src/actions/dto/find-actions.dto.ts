import { IsOptional, IsString, IsEnum } from 'class-validator';
import {
  ActionSortBy,
  SortDirection,
} from '@common-lib/common-lib/common/enum';
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination2.dto';
import { ActionStatus } from '../domain';

export class FindActionsDto extends QueryPaginationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(ActionStatus)
  status?: ActionStatus;

  @IsOptional()
  @IsEnum(ActionSortBy)
  sortBy?: ActionSortBy;

  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}
