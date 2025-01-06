import { IsOptional, IsString, IsEnum, IsDate } from 'class-validator';
import { QueryPaginationDto } from '@common-lib/common-lib/dto/query-pagination2.dto';
import { Type } from 'class-transformer';
import { StatusRequest } from '../domain/StatusRequest';

export class FindCreateCommunitiesDto extends QueryPaginationDto {
  @IsOptional()
  @IsEnum(StatusRequest)
  @IsString()
  status?: StatusRequest;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;
}
