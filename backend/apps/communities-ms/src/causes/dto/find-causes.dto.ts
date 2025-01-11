import { IsOptional, IsString, IsArray, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { CauseSortBy, SortDirection } from '@common-lib/common-lib/common/enum';
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FindCausesDto extends QueryPaginationDto {
  @ApiProperty({
    description: 'ODS to filter (comma-separated values)',
    type: String,
    example: '1,2,3',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ODSEnum, { each: true })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map(Number) : value,
  )
  ods?: ODSEnum[];

  @ApiProperty({
    description: 'Name of the cause',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Field to sort by',
    required: false,
    enum: CauseSortBy,
    example: CauseSortBy.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(CauseSortBy)
  sortBy?: CauseSortBy;

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
