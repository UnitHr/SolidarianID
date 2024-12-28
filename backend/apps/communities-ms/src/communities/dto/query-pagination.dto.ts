// dto/query-pagination.dto.ts
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryPaginationDto {
  @IsOptional() // Not mandatory
  @Type(() => Number) // Automatically converts the value to a number
  @IsInt({ message: 'The skip parameter must be an integer' })
  @Min(0, { message: 'The skip parameter must be greater than or equal to 0' })
  offset?: number;

  @IsOptional() // Not mandatory
  @Type(() => Number) // Automatically converts the value to a number
  @IsInt({ message: 'The limit parameter must be an integer' })
  @Min(1, { message: 'The limit parameter must be greater than or equal to 1' })
  @Max(100, {
    message: 'The limit parameter must be less than or equal to 100',
  })
  limit?: number;
}
