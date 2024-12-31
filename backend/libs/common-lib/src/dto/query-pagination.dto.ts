import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryPaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'The skip parameter must be an integer' })
  @Min(0, { message: 'The skip parameter must be greater than or equal to 0' })
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'The limit parameter must be an integer' })
  @Min(1, { message: 'The limit parameter must be greater than or equal to 1' })
  limit?: number;
}
