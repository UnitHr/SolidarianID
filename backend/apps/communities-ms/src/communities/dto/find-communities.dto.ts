import { IsOptional, IsString } from 'class-validator';
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination2.dto';

export class FindCommunitiesDto extends QueryPaginationDto {
  @IsOptional()
  @IsString()
  name?: string;
}
