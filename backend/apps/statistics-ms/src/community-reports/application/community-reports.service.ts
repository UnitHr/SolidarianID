import * as Domain from '../domain';

export abstract class CommunityReportsService {
  abstract findOne(id: string): Promise<Domain.CommunityReport>;
}
