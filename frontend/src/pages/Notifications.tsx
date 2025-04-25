import { Alert, Button, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import { SolidarianNavbar } from "../components/SolidarianNavbar";
import { useEffect, useState } from "react";
import "../index.css";
import { ModalValidateJoinCommunity } from "../components/ModalValidateJoinCommunity";
import {
  registerServiceWorker,
  registerSubscriptionOnServer,
  subscribeUserToPushManager,
} from '../services/push-notification.service';
import {
  fetchCreateCommunityRequests,
  fetchManagedCommunities,
} from '../services/notificacion.service';
import { CreateCommunityRequestCard } from '../components/CreateCommunityRequestCard';
import { approveCommunityRequest, rejectCommunityRequest } from '../services/community.service';


interface JoinComunityRequestValues{
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
  const [managedCommunities, setManagedCommunities] = useState<string[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinComunityRequestValues[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [notificationsEnabled, setNotificationsEnabled] = useState(false); // Estado para saber si las notificaciones están activadas
  const [currentCommunity, setCurrentCommunity] = useState('');
  const pageSize = 5;

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

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
          const requests = await fetchCreateCommunityRequests();
          setPendingRequests(requests); // Actualiza las solicitudes pendientes
        } else {
          const managedCommunities = await fetchManagedCommunities();
          if (managedCommunities.length > 0) {
            setIsCommunityAdmin(true);
            setManagedCommunities(managedCommunities);
            setCurrentCommunity(managedCommunities[0]);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRequests();
  }, []);

  async function handleEnableNotifications() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        try {
          const registration = await registerServiceWorker();
          const subscription = await subscribeUserToPushManager(registration);

          const userId = JSON.parse(localStorage.getItem('user') || '{}').userId;
          const userRoles = JSON.parse(localStorage.getItem('user') || '{}').roles || [];

          await registerSubscriptionOnServer(subscription, userId, userRoles);

          setNotificationsEnabled(true); // Actualiza el estado
        } catch (error) {
          console.error('Error durante la activación de notificaciones:', error);
        }
      } else {
        console.log('Permiso de notificaciones denegado');
      }
    } else {
      console.log('Notificaciones o Service Workers no son compatibles con este navegador');
    }
  }

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

  const handleOpenRejectModal = (requestId: string) => {
    setCurrentRequestId(requestId);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleApproveRequest = async (requestId: string) => {
    const success = await approveCommunityRequest(requestId);
    if (success) {
      alert('Request approved successfully!');
    } else {
      alert('Failed to approve the request.');
    }
  };

  const handleConfirmReject = async () => {
    if (currentRequestId) {
      const success = await rejectCommunityRequest(currentRequestId, rejectionReason);
      if (success) {
        alert('Request rejected successfully!');
      } else {
        alert('Failed to reject the request.');
      }
      setShowRejectModal(false);
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
          communityName="Amigos por África"
          userName="pepe martinez"
          userId="1234"
          communityId="1234"
          changeAlertMessage={changeAlertMessage}
          changeAlertVariant={changeAlertVariant}
          handleAlertShow={() => setShowAlert(true)}
          joinRequestId="1234"
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
                      <CreateCommunityRequestCard
                        key={request.id}
                        communityName={request.communityName}
                        communityDescription={request.communityDescription}
                        userId={request.userId}
                        causeTitle={request.causeTitle}
                        causeDescription={request.causeDescription}
                        causeEndDate={request.causeEndDate}
                        causeOds={request.causeOds}
                        onApprove={() => handleApproveRequest(request.id)} // Llama a la función de aprobación
                        onReject={() => handleOpenRejectModal(request.id)}
                      />
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

          <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Rechazar solicitud</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="rejectionReason">
                <Form.Label>Motivo del rechazo</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Especifica el motivo del rechazo..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmReject}
                disabled={!rejectionReason.trim()}
              >
                Confirmar rechazo
              </Button>
            </Modal.Footer>
          </Modal>

          {isCommunityAdmin && (
            <Row className="my-5">
              <h2>Solicitudes de unión a comunidades pendientes</h2>
              <Form.Select value={currentCommunity} onChange={handleCommunityChange}>
                <option value="">Select a community</option>
                {managedCommunities.map((community) => (
                  <option key={community} value={community}>
                    {community}
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
