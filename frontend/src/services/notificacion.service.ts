import { getStoredUser, getToken, getUserNameById } from './user.service';

const API_URL = 'http://localhost:3000/api/v1';

/** Notification types */

const USER_NOTIFICATION_TYPES = [
  'COMMUNITY_ADMIN',
  'JOIN_COMMUNITY_REQUEST_REJECTED',
  'JOINED_COMMUNITY',
  'CAUSE_SUPPORT',
  'CAUSE_CREATED',
  'ACTION_CREATED',
  'ACTION_CONTRIBUTED',
  'USER_FOLLOWED',
];

const CREATION_REQUEST_TYPES = ['COMMUNITY_CREATION_REQUEST_SENT'];

const JOIN_REQUEST_TYPES = ['JOIN_COMMUNITY_REQUEST_SENT'];

// declare the Notification type
export interface Notification {
  id: string;
  read: boolean;
  date: string;
  type: string;
  userId: string;
  userName: string;
  notificationMessage: string;
  entityName: string;
  entityId: string;
}

// Función principal que fetch las notificaciones y las clasifica
export async function fetchUserNotifications(userId: string) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/notifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    const data = await response.json();

    const detailedNotifications = await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.data.map(async (notification: any) => {
        const { id, read, timestamp, userId, type, entityName } = notification;
        const date = new Date(timestamp).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        const { userName, notificationMessage } = await fetchNotificationDetails(
          userId,
          type,
          entityName
        );
        return {
          //notification, // Conservamos el type para clasificar luego
          id,
          read,
          date,
          type,
          userId,
          userName,
          notificationMessage,
          entityName,
          entityId: notification.entityId,
        };
      })
    );
    // console.log('Detailed Notifications:', detailedNotifications);

    const { userNotifications, joinRequests } = classifyNotifications(detailedNotifications);
    // console.log('User Notifications from service:', userNotifications);
    // console.log('Pending Requests from service:', pendingRequests);
    return { userNotifications, joinRequests };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

async function fetchNotificationDetails(userId: string, type: string, entityName: string) {
  const userName = await getUserNameById(userId);
  const notificationMessage = getNotificationMessage(type) + entityName;
  const notificationDetails = {
    userName,
    notificationMessage,
  };
  return notificationDetails;
}

const getNotificationMessage = (type: string) => {
  switch (type) {
    case 'COMMUNITY_ADMIN':
      return 'You are now an administrator of a community';
    case 'JOIN_COMMUNITY_REQUEST_SENT':
      return 'Sent a request to join a community: ';
    case 'JOIN_COMMUNITY_REQUEST_REJECTED':
      return 'Your request to join a community was rejected';
    case 'JOINED_COMMUNITY':
      return 'Joined a community';
    case 'CAUSE_SUPPORT':
      return 'Supported the cause: ';
    case 'CAUSE_CREATED':
      return 'Created a new cause: ';
    case 'ACTION_CONTRIBUTED':
      return 'Contributed to the action: ';
    case 'ACTION_CREATED':
      return 'Created a new action: ';
    case 'USER_FOLLOWED':
      return 'Started following you';
    case 'COMMUNITY_CREATION_REQUEST_SENT':
      return 'Requested the creation of a community';
    default:
      return 'New notification';
  }
};

// Función para clasificar las notificaciones
function classifyNotifications(notifications: Notification[]) {
  const userNotifications: Notification[] = [];
  const creationRequests: Notification[] = [];
  const joinRequests: Notification[] = [];

  notifications.forEach((notification) => {
    if (USER_NOTIFICATION_TYPES.includes(notification.type)) {
      userNotifications.push(notification);
    } else if (CREATION_REQUEST_TYPES.includes(notification.type)) {
      creationRequests.push(notification);
    } else if (JOIN_REQUEST_TYPES.includes(notification.type)) {
      joinRequests.push(notification);
    }
  });

  return { userNotifications, creationRequests, joinRequests };
}

/** Mark notification as read */
export async function markNotificationAsRead(notificationId: string) {
  const userId = getStoredUser()?.userId;
  const token = getToken();

  try {
    const response = await fetch(`${API_URL}/users/${userId}/notifications/${notificationId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }

    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}
