import { gql } from '@apollo/client';

export const GET_COMMUNITY_BY_ID = gql`
  query GetCommunity($id: ID!) {
    community(id: $id) {
      id
      name
      description
      adminId
      admin {
        id
        firstName
        lastName
      }
    }
  }
`;
