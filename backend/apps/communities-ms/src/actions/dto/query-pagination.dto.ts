import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryPaginationDto {
  @IsOptional()
  @Type(() => Number) // Convierte el string de la query a número
  @IsInt() // Valida que sea un entero
  @Min(1) // Valida que sea al menos 1
  page?: number;

  @IsOptional()
  @Type(() => Number) // Convierte el string de la query a número
  @IsInt() // Valida que sea un entero
  @Min(1) // Valida que sea al menos 1
  size?: number;
}
