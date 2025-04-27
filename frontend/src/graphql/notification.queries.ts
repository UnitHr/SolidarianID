import { gql } from '@apollo/client';
import { NOTIFICATION_FRAGMENT } from './fragments';

export const NOTIFICATION_SUBSCRIPTION = gql`
  subscription NotificationAdded($userId: ID!) {
    notificationAdded(userId: $userId) {
      ...NotificationFields
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;
