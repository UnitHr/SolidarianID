export async function fetchCreateCommunityRequests() {
  try {
    const response = await fetch(
      'http://localhost:3000/api/v1/communities/creation-requests?status=pending',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch pending requests');
    }

    const data = await response.json();
    return data.data; // Devuelve las solicitudes
  } catch (error) {
    console.error('Error al obtener las solicitudes de creación de comunidad:', error);
    throw error;
  }
}

export async function fetchManagedCommunities() {
  try {
    const response = await fetch('http://localhost:3000/api/v1/communities/managed-communities', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch managed communities');
    }

    const data = await response.json();
    return data.data; // Devuelve las comunidades gestionadas
  } catch (error) {
    console.error('Error al obtener las comunidades gestionadas:', error);
    throw error;
  }
}

export async function fetchUserNotifications(userId: string) {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/users/${userId}/notifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    const data = await response.json();

    const detailedNotifications = await Promise.all(
      data.data.map(async (notification: any) => {
        const { timestamp, userId, type, entityName } = notification;
        const date = new Date(timestamp).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        const { userName, notificationMessage } = await fetchNotificationDetails(userId, type);
        return {
          // ...notification,
          date,
          userName,
          notificationMessage,
          entityName,
        };
      })
    );
    console.log(detailedNotifications);
    return detailedNotifications;
  } catch (error) {
    console.error('Error al obtener las notificaciones:', error);
    throw error;
  }
}

export async function fetchNotificationDetails(userId: string, type: string) {
  const userName = await getUserNameById(userId);
  const notificationMessage = getNotificationMessage(type);
  const notificationDetails = {
    userName,
    notificationMessage,
  };
  console.log('Notification Details:', notificationDetails);
  return notificationDetails;
}

const getUserNameById = async (userId: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const data = await response.json();
    return data.firstName + ' ' + data.lastName;
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    throw error;
  }
};

const getNotificationMessage = (type: string) => {
  switch (type) {
    case 'COMMUNITY_ADMIN':
      return 'You are now an administrator of a community';
    case 'JOIN_COMMUNITY_REQUEST_SENT':
      return 'Sent a request to join a community';
    case 'JOIN_COMMUNITY_REQUEST_REJECTED':
      return 'Your request to join a community was rejected';
    case 'JOINED_COMMUNITY':
      return 'Joined a community';
    case 'CAUSE_SUPPORT':
      return 'Supported a cause';
    case 'CAUSE_CREATED':
      return 'Created a new cause';
    case 'ACTION_CONTRIBUTED':
      return 'Contributed to an action';
    case 'USER_FOLLOWED':
      return 'Started following you';
    case 'COMMUNITY_CREATION_REQUEST_SENT':
      return 'Requested the creation of a community';
    default:
      return 'New notification';
  }
};
