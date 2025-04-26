import { Alert, Button, Col, Container, Form, ListGroup, Row } from 'react-bootstrap';
import { SolidarianNavbar } from '../components/SolidarianNavbar';
import { useEffect, useState } from 'react';
import '../index.css';
import { ModalValidateJoinCommunity } from '../components/ModalValidateJoinCommunity';

interface JoinComunityRequestValues {
  id: string;
  userId: string;
  communityId: string;
  communityName: string;
  status: string;
  comment: string;
}

export function Notifications() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCommunityAdmin, setIsCommunityAdmin] = useState(false);

  const [managedCommunities, setManagedCommunities] = useState<{ id: string; name: string }[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinComunityRequestValues[]>([]);

  const [showModal, setShowModal] = useState(true);
  const [modalCommunityName, setModalCommunityName] = useState('');
  const [modalUserId, setModalUserId] = useState('');
  const [modalCommunityId, setModalCommunityId] = useState('');
  const [modalJoinRequestId, setModalJoinRequestId] = useState('');

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [notificationsEnabled, setNotificationsEnabled] = useState(false); // Estado para saber si las notificaciones están activadas
  const [currentCommunity, setCurrentCommunity] = useState('');
  const pageSize = 5;

  function changeAlertMessage(value: string) {
    setAlertMessage(value);
  }

  function changeAlertVariant(value: string) {
    setAlertVariant(value);
  }

  async function fetchJoinRequests() {
    const response = await fetch(
      `http://localhost:3000/api/v1/communities/${currentCommunity}/join-requests`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setJoinRequests(data.data);
    } else {
      setAlertMessage('Error fetching join requests for community ' + currentCommunity);
      setAlertVariant('danger');
      setShowAlert(true);
    }
  }

  function handleCommunityChange(event) {
    setCurrentCommunity(event.target.value);
  }

  useEffect(() => {
    const fetchRequests = async () => {
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
        } else {
          // Check if user is community admin
          const response = await fetch(
            'http://localhost:3000/api/v1/communities/managed-communities',
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );

          const data = await response.json();
          if (data.data.length > 0) {
            setIsCommunityAdmin(true);
            setManagedCommunities(data.data);
            setCurrentCommunity(data.data[0]);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRequests();
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
          const response = await fetch('http://localhost:4000/push/vapidPublicKey', {
            credentials: 'include',
          });
          const vapidPublicKey = await response.text();
          const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          });

          const userId = JSON.parse(localStorage.getItem('user') || '{}').userId;
          const userRoles = JSON.parse(localStorage.getItem('user') || '{}').roles || [];

          console.log('Nueva suscripción creada:', subscription, userId, userRoles);
          // } else {
          //  console.log('Suscripción existente encontrada:', subscription);
          // }

          // Registra la suscripción en el servidor
          try {
            const serverResponse = await fetch('http://localhost:4000/push/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({ subscription, userId, userRoles }),
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
      {showAlert && (
        <Alert variant={alertVariant} onClose={(e) => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      )}
      <Container>
        <ModalValidateJoinCommunity
          show={showModal}
          communityName={modalCommunityName}
          userId={modalUserId}
          communityId={modalCommunityId}
          changeAlertMessage={changeAlertMessage}
          changeAlertVariant={changeAlertVariant}
          handleAlertShow={() => setShowAlert(true)}
          joinRequestId={modalJoinRequestId}
          handleHide={() => setShowModal(false)}
        ></ModalValidateJoinCommunity>
        <Row>
          <Row className="my-3 justify-content-end">
            <Button
              variant="warning"
              onClick={handleEnableNotifications}
              disabled={notificationsEnabled}
              style={{
                fontSize: '0.8rem',
                padding: '5px 10px',
                width: 'auto',
              }}
            >
              {notificationsEnabled ? 'Notificaciones activadas' : 'Activar notificaciones'}
            </Button>
          </Row>
          <Row className="my-5">
            <h1 className="text-center">Notifications</h1>
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

          {isCommunityAdmin && (
            <Row className="my-5">
              <h2>Solicitudes de unión a comunidades pendientes</h2>
              <Form.Select value={currentCommunity} onChange={handleCommunityChange}>
                <option value="">Select a community</option>
                {managedCommunities.map((community) => (
                  <option key={community.id} value={community.id}>
                    {community.name}
                  </option>
                ))}
              </Form.Select>
              <ListGroup>
                {joinRequests.length > 0 ? (
                  joinRequests.map((request) => (
                    <ListGroup.Item key={request.id}>
                      <strong>Community name:</strong> {request.communityName} <br />
                      <strong>User ID:</strong> {request.userId} <br />
                      <Button
                        variant="primary"
                        onClick={() => {
                          setShowModal(true);
                          setModalCommunityName(request.communityName);
                          setModalCommunityId(request.communityId);
                          setModalUserId(request.userId);
                          setModalJoinRequestId(request.id);
                        }}
                      >
                        Validate
                      </Button>
                    </ListGroup.Item>
                  ))
                ) : (
                  <p>No hay solicitudes pendientes.</p>
                )}
              </ListGroup>
            </Row>
          )}
        </Row>
      </Container>
    </>
  );
}
