import { IsOptional, IsString, IsEnum } from 'class-validator';
import {
  ActionSortBy,
  SortDirection,
} from '@common-lib/common-lib/common/enum';
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ActionStatus } from '../domain';

export class FindActionsDto extends QueryPaginationDto {
  @ApiProperty({
    description: 'Filter by name',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Filter by status',
    required: false,
    enum: ActionStatus,
    example: ActionStatus.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(ActionStatus)
  status?: ActionStatus;

  @ApiProperty({
    description: 'Field to sort by',
    required: false,
    enum: ActionSortBy,
    example: ActionSortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(ActionSortBy)
  sortBy?: ActionSortBy;

  @ApiProperty({
    description: 'Sort direction',
    required: false,
    enum: SortDirection,
    example: SortDirection.ASC,
  })
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}
