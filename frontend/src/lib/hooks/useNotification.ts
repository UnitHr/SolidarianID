import { useEffect } from 'react';
import { useSubscription } from '@apollo/client';
import { NOTIFICATION_SUBSCRIPTION } from '../../graphql/notification.queries';
import { NotificationType } from '../types/notification.types';

/**
 * Hook to subscribe to notifications using GraphQL subscriptions
 */
export const useNotificationSubscription = (
  userId: string,
  onReceived: (notification: NotificationType) => void,
  onError?: (error: Error) => void
) => {
  const { data, loading, error } = useSubscription(NOTIFICATION_SUBSCRIPTION, {
    variables: { userId },
    skip: !userId, // Skip subscription if userId is falsy
  });

  // Effect to handle incoming notifications
  useEffect(() => {
    if (data?.notificationAdded) {
      onReceived(data.notificationAdded);
    }
  }, [data, onReceived]);

  // Effect to handle errors
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  return {
    loading,
    error,
    latestNotification: data?.notificationAdded as NotificationType | undefined,
  };
};
