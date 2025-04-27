import { gql } from '@apollo/client';
import { COMMUNITY_WITH_ADMIN_FRAGMENT } from './fragments';

export const GET_COMMUNITY_BY_ID = gql`
  query GetCommunity($id: ID!) {
    community(id: $id) {
      ...CommunityWithAdminFields
    }
  }
  ${COMMUNITY_WITH_ADMIN_FRAGMENT}
`;
