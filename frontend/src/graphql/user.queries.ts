import { gql } from '@apollo/client';
import { USER_EXTENDED_FRAGMENT, USER_FRAGMENT } from './fragments';

export const GET_USER_BY_ID = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      ...UserExtendedFields
    }
  }
  ${USER_EXTENDED_FRAGMENT}
`;

export const CREATE_USER = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;
