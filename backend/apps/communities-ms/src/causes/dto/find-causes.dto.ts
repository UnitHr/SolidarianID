import { IsOptional, IsString, IsArray, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { CauseSortBy, SortDirection } from '@common-lib/common-lib/common/enum';
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination.dto';

export class FindCausesDto extends QueryPaginationDto {
  @IsOptional()
  @IsArray()
  @IsEnum(ODSEnum, { each: true })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map(Number) : value,
  )
  ods?: ODSEnum[];

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(CauseSortBy)
  sortBy?: CauseSortBy;

  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}
