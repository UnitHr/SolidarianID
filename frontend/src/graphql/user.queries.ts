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

export const CREATE_USER = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
      firstName
      lastName
      email
    }
  }
`;
