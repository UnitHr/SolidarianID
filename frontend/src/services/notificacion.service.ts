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
