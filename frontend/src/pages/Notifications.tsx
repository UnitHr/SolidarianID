import { Button, Container, Row } from 'react-bootstrap';
import { SolidarianNavbar } from '../components/SolidarianNavbar';
import { useEffect, useState } from 'react';
import '../index.css';

export function Notifications() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false); // Estado para saber si las notificaciones están activadas
  const pageSize = 5;

  // Fetch user role and pending requests
  useEffect(() => {
    const fetchUserRoleAndRequests = async () => {
      try {
        const userRoles = JSON.parse(localStorage.getItem('user') || '{}').roles || [];
        const isAdminRole = userRoles.includes('admin');
        setIsAdmin(isAdminRole);

        if (isAdminRole) {
          const requestsResponse = await fetch(
            'http://localhost:3002/communities/creation-requests?status=pending',
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          if (!requestsResponse.ok) {
            throw new Error('Failed to fetch pending requests');
          }
          const requestsData = await requestsResponse.json();
          setPendingRequests(requestsData.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserRoleAndRequests();
  }, []);

  const handleEnableNotifications = async () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        navigator.serviceWorker.register('/javascripts/sw.js').then(async (registration) => {
          console.log('Service Worker registrado:', registration);

          // Obtén la suscripción existente o crea una nueva
          // let subscription = await registration.pushManager.getSubscription();
          //  if (!subscription) {
          const response = await fetch('https://localhost:443/push/vapidPublicKey', {
            credentials: 'include',
          });
          const vapidPublicKey = await response.text();
          const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          });

          console.log('Nueva suscripción creada:', subscription);
          // } else {
          //  console.log('Suscripción existente encontrada:', subscription);
          // }

          // Registra la suscripción en el servidor
          try {
            const serverResponse = await fetch('https://localhost/push/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({ subscription }),
            });

            if (serverResponse.ok) {
              console.log('Suscripción registrada en el servidor');
            } else {
              console.error(
                'Error al registrar la suscripción en el servidor:',
                await serverResponse.text()
              );
            }
          } catch (error) {
            console.error('Error al enviar la suscripción al servidor:', error);
          }

          setNotificationsEnabled(true); // Actualiza el estado
        });
      } else {
        console.log('Permiso de notificaciones denegado');
      }
    } else {
      console.log('Notificaciones o Service Workers no son compatibles con este navegador');
    }
  };
  // Calculate paginated data
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRequests = pendingRequests.slice(startIndex, startIndex + pageSize);

  // Handle pagination
  const totalPages = Math.ceil(pendingRequests.length / pageSize);
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <SolidarianNavbar></SolidarianNavbar>
      <Container>
        <Row>
          <Row className="my-5">
            <h1 className="text-center">Notifications</h1>
          </Row>
          <Row className="my-3">
            <Button
              variant="primary"
              onClick={handleEnableNotifications}
              disabled={notificationsEnabled}
            >
              {notificationsEnabled ? 'Notificaciones activadas' : 'Activar notificaciones'}
            </Button>
          </Row>
          {isAdmin && (
            <Row className="my-5">
              <h2>Solicitudes de creación de comunidad pendientes</h2>
              {pendingRequests.length > 0 ? (
                <>
                  <div className="panel">
                    {paginatedRequests.map((request) => (
                      <div key={request.id} className="request-card">
                        <strong>Nombre de la comunidad:</strong> {request.communityName} <br />
                        <strong>Descripción de la comunidad:</strong> {request.communityDescription}{' '}
                        <br />
                        <strong>Usuario ID:</strong> {request.userId} <br />
                        <strong>Causa:</strong>
                        <ul>
                          <li>
                            <strong>Título:</strong> {request.causeTitle}
                          </li>
                          <li>
                            <strong>Descripción:</strong> {request.causeDescription}
                          </li>
                          <li>
                            <strong>Fecha Fin:</strong>{' '}
                            {new Date(request.causeEndDate).toLocaleDateString()}
                          </li>
                          <li>
                            <strong>ODS:</strong>{' '}
                            {request.causeOds.map((ods: { title: any }) => ods.title).join(', ')}
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="pagination-controls">
                    <Button
                      variant="primary"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <span className="mx-3">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="primary"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </>
              ) : (
                <p>No hay solicitudes pendientes.</p>
              )}
            </Row>
          )}
        </Row>
      </Container>
    </>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  if (!base64String) {
    throw new Error('El valor de base64String está vacío o es inválido.');
  }

  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  try {
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  } catch (error) {
    console.error('Error al decodificar Base64:', error);
    throw new Error('El valor de base64String no es válido.');
  }
}
