import { IsOptional, IsString } from 'class-validator';
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination.dto';

export class FindCommunitiesDto extends QueryPaginationDto {
  @IsOptional()
  @IsString()
  name?: string;
}
