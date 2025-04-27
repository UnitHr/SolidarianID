import { gql } from '@apollo/client';

export const GET_USER_BY_ID = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      age
      email
      bio
      followersCount
      followingCount
    }
  }
`;
