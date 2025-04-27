import { gql } from '@apollo/client';

export const NOTIFICATION_SUBSCRIPTION = gql`
  subscription NotificationAdded($userId: ID!) {
    notificationAdded(userId: $userId) {
      id
      read
      timestamp
      recipientId
      userId
      type
      entityId
      entityName
    }
  }
`;
