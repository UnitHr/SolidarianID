import { Alert, Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import '../styles/index.css';
import {
  registerServiceWorker,
  registerSubscriptionOnServer,
  subscribeUserToPushManager,
} from '../services/push-notification.service';
import { fetchUserNotifications } from '../services/notificacion.service';
import { CreateCommunityRequestCard } from '../components/CreateCommunityRequestCard';
import {
  approveCommunityRequest,
  fetchCreateCommunityRequests,
  rejectCommunityRequest,
} from '../services/community.service';
import { NotificationCard } from '../components/NotificationCard';

export function Notifications() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [creationRequests, setCreationRequests] = useState<any[]>([]);
  const [followedNotifications, setFollowedNotifications] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [notificationsEnabled, setNotificationsEnabled] = useState(false); // Estado para saber si las notificaciones están activadas
  const [currentCommunity, setCurrentCommunity] = useState('');
  const pageSize = 5;

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  function handleCommunityChange(event) {
    setCurrentCommunity(event.target.value);
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      const userRoles = JSON.parse(localStorage.getItem('user') || '{}').roles || [];
      const isAdminRole = userRoles.includes('admin');
      setIsAdmin(isAdminRole);
      const userId = JSON.parse(localStorage.getItem('user') || '{}').userId;
      try {
        const { userNotifications, joinRequests } = await fetchUserNotifications(userId);
        setFollowedNotifications(userNotifications || []);

        if (isAdminRole) {
          const creationRequests = await fetchCreateCommunityRequests();
          setCreationRequests(creationRequests || []);
        }
        console.log('Creation Requests:', creationRequests);
        setJoinRequests(joinRequests || []);
      } catch (error) {
        console.error('Error fetching followed notifications:', error);
      }
    };

    fetchNotifications();
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
  const paginatedRequests = creationRequests.slice(startIndex, startIndex + pageSize);

  // Handle pagination
  const totalPages = Math.ceil(creationRequests.length / pageSize);
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
      {showAlert && (
        <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      )}
      <Container>
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
            {notificationsEnabled ? 'Notifications enabled' : 'Enable notifications'}
          </Button>
        </Row>

        <Row className="my-5">
          <h1 className="text-center">Notifications</h1>
        </Row>

        <Row>
          {/* Columna izquierda: Followed Notifications */}
          <Col md={isAdmin ? 4 : 6}>
            <h4>Your Notifications</h4>
            {followedNotifications.length > 0 ? (
              <>
                {followedNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notificationId={notification.id}
                    read={notification.read}
                    date={notification.date}
                    userId={notification.userId}
                    userName={notification.userName}
                    message={notification.notificationMessage}
                    entityId={notification.entityId}
                    type="user"
                  />
                ))}
              </>
            ) : (
              <p>No new notifications.</p>
            )}
          </Col>

          {/* Columna central: Join Requests */}
          <Col md={isAdmin ? 4 : 6}>
            <h4>Join Community Requests</h4>
            {joinRequests.length > 0 ? (
              <>
                {joinRequests.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notificationId={notification.id}
                    read={notification.read}
                    date={notification.date}
                    userId={notification.userId}
                    userName={notification.userName}
                    message={notification.notificationMessage}
                    entityId={notification.entityId}
                    type="joinRequest"
                  />
                ))}
              </>
            ) : (
              <p>No join community requests.</p>
            )}
          </Col>

          {/* Columna derecha: Creation Requests (solo si es admin) */}
          {isAdmin && (
            <Col md={4}>
              <h4>Community Creation Requests</h4>
              {paginatedRequests.length > 0 ? (
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
                        onApprove={() => handleApproveRequest(request.id)}
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
                      Previous
                    </Button>
                    <span className="mx-3">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="primary"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </>
              ) : (
                <p>No pending creation requests.</p>
              )}
            </Col>
          )}
        </Row>

        {/* Modales de rechazo y validación */}
        <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Reject Request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="rejectionReason">
              <Form.Label>Reason for rejection</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Specify the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmReject}
              disabled={!rejectionReason.trim()}
            >
              Confirm rejection
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}
