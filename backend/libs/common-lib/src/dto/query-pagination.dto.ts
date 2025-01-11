import { Type, Transform } from 'class-transformer';
import { IsOptional, IsPositive, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDefaults } from '../common/enum';

export class QueryPaginationDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
  })
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => value ?? PaginationDefaults.DEFAULT_PAGE)
  page: number = PaginationDefaults.DEFAULT_PAGE;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => value ?? PaginationDefaults.DEFAULT_LIMIT)
  @Max(PaginationDefaults.MAX_LIMIT, {
    message: `Limit cannot exceed ${PaginationDefaults.MAX_LIMIT} items`,
  })
  limit: number = PaginationDefaults.DEFAULT_LIMIT;
}
