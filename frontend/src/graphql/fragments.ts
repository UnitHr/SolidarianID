import { gql } from '@apollo/client';

export const USER_FRAGMENT = gql`
  fragment UserFields on UserModel {
    __typename
    id
    firstName
    lastName
    email
    bio
  }
`;

export const USER_EXTENDED_FRAGMENT = gql`
  fragment UserExtendedFields on UserModel {
    __typename
    id
    firstName
    lastName
    age
    email
    bio
    followersCount
    followingCount
  }
`;

export const COMMUNITY_FRAGMENT = gql`
  fragment CommunityFields on CommunityModel {
    __typename
    id
    name
    description
    adminId
  }
`;

export const COMMUNITY_WITH_ADMIN_FRAGMENT = gql`
  fragment CommunityWithAdminFields on CommunityModel {
    __typename
    id
    name
    description
    adminId
    admin {
      __typename
      id
      firstName
      lastName
    }
  }
`;

export const NOTIFICATION_FRAGMENT = gql`
  fragment NotificationFields on NotificationModel {
    __typename
    id
    read
    timestamp
    recipientId
    userId
    type
    entityId
    entityName
  }
`;
