export type NotificationType = {
  id: string;
  read: boolean;
  date: string;
  userId: string;
  userName: string;
  notificationMessage: string;
  entityId: string;
  entityName: string;
  notificationType: string;
};

/** Notification types */

export const USER_NOTIFICATION_TYPES = [
  'COMMUNITY_ADMIN',
  'JOIN_COMMUNITY_REQUEST_REJECTED',
  'JOINED_COMMUNITY',
  'CAUSE_SUPPORT',
  'CAUSE_CREATED',
  'ACTION_CREATED',
  'ACTION_CONTRIBUTED',
  'USER_FOLLOWED',
];

export const CREATION_REQUEST_TYPES = ['COMMUNITY_CREATION_REQUEST_SENT'];

export const JOIN_REQUEST_TYPES = ['JOIN_COMMUNITY_REQUEST_SENT'];
