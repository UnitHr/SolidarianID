import { ApolloError } from '@apollo/client';
import { apolloClient } from '../lib/apolloClient';
import { NOTIFICATION_SUBSCRIPTION } from '../graphql/notification.queries';
import { NotificationType } from '../lib/types/notification.types';

export interface NotificationSubscriptionOptions {
  onReceived: (notification: NotificationType) => void;
  onError?: (error: Error) => void;
}

export async function subscribeToNotifications(
  userId: string,
  { onReceived, onError }: NotificationSubscriptionOptions
) {
  try {
    const subscription = apolloClient
      .subscribe({
        query: NOTIFICATION_SUBSCRIPTION,
        variables: { userId },
      })
      .subscribe({
        next: (response) => {
          const notification = response?.data?.notificationAdded;
          if (notification) {
            onReceived(notification);
          }
        },
        error: (error) => {
          console.error('Notification subscription error:', error);
          if (onError) {
            onError(new Error(error.message));
          }
        },
      });

    return subscription;
  } catch (error) {
    console.error('Error setting up notification subscription:', error);
    if (error instanceof ApolloError) {
      throw new Error(error.message);
    }
    throw error;
  }
}
