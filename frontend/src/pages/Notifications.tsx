import { Col, Container, Row } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import '../styles/index.css';
import { fetchUserNotifications } from '../services/notification.service';
import { CreateCommunityRequestCard } from '../components/CreateCommunityRequestCard';
import { fetchCreateCommunityRequests } from '../services/community.service';
import { NotificationCard } from '../components/NotificationCard';
import { Paginate } from '../components/Pagination';
import { NotificationType } from '../lib/types/notification.types';
import { CreationRequestType } from '../lib/types/community.types';
import { getStoredUser } from '../services/user.service';

const UserNotificationType = 'user';
const JoinRequestType = 'joinRequest';

export function Notifications() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [followedNotifications, setFollowedNotifications] = useState<NotificationType[]>([]);
  const [joinRequests, setJoinRequests] = useState<NotificationType[]>([]);
  const [creationRequests, setCreationRequests] = useState<CreationRequestType[]>([]);

  // Estados de paginación independientes
  const [notificationPage, setNotificationPage] = useState(1);
  const [joinRequestPage, setJoinRequestPage] = useState(1);
  const [creationRequestPage, setCreationRequestPage] = useState(1);

  const [totalNotificationPages, setTotalNotificationPages] = useState(0);
  const [totalJoinRequestPages, setTotalJoinRequestPages] = useState(0);
  const [totalCreationRequestPages, setTotalCreationRequestPages] = useState(0);

  const pageSize = 5;

  useEffect(() => {
    const fetchNotifications = async () => {
      const storedUser = getStoredUser();
      if (!storedUser) {
        console.error('No user found in local storage');
        return;
      }
      const isAdminRole = storedUser.roles.includes('admin');
      setIsAdmin(isAdminRole);
      const userId = storedUser.userId;
      try {
        const { userNotifications, joinRequests } = await fetchUserNotifications(userId);
        setFollowedNotifications(userNotifications || []);
        setTotalNotificationPages(Math.ceil((userNotifications?.length || 0) / pageSize));

        setJoinRequests(joinRequests || []);
        setTotalJoinRequestPages(Math.ceil((joinRequests?.length || 0) / pageSize));

        if (isAdminRole) {
          const creationRequests = await fetchCreateCommunityRequests();
          setCreationRequests(creationRequests || []);
          setTotalCreationRequestPages(Math.ceil((creationRequests?.length || 0) / pageSize));
        }
      } catch (error) {
        console.error('Error fetching followed notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Cálculo de los elementos a mostrar por página
  const paginatedNotifications = followedNotifications.slice(
    (notificationPage - 1) * pageSize,
    notificationPage * pageSize
  );
  const paginatedJoinRequests = joinRequests.slice(
    (joinRequestPage - 1) * pageSize,
    joinRequestPage * pageSize
  );
  const paginatedCreationRequests = creationRequests.slice(
    (creationRequestPage - 1) * pageSize,
    creationRequestPage * pageSize
  );

  return (
    <Container>
      <Row className="my-5">
        <h1 className="text-center">Notifications</h1>
      </Row>

      <Row>
        {/* Columna izquierda: Followed Notifications */}
        <Col md={isAdmin ? 4 : 6}>
          <h4>Your Notifications</h4>
          {paginatedNotifications.length > 0 ? (
            <>
              {paginatedNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notificationId={notification.id}
                  read={notification.read}
                  date={notification.date}
                  userId={notification.userId}
                  userName={notification.userName}
                  message={notification.notificationMessage}
                  entityId={notification.entityId}
                  type={UserNotificationType}
                />
              ))}
              <Row className="mt-4">
                <Col className="d-flex justify-content-center">
                  <Paginate
                    currentPage={notificationPage}
                    totalPages={totalNotificationPages}
                    onPageChange={setNotificationPage}
                  />
                </Col>
              </Row>
            </>
          ) : (
            <p>No new notifications.</p>
          )}
        </Col>

        {/* Columna central: Join Requests */}
        <Col md={isAdmin ? 4 : 6}>
          <h4>Join Community Requests</h4>
          {paginatedJoinRequests.length > 0 ? (
            <>
              {paginatedJoinRequests.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notificationId={notification.id}
                  read={notification.read}
                  date={notification.date}
                  userId={notification.userId}
                  userName={notification.userName}
                  message={notification.notificationMessage}
                  entityId={notification.entityId}
                  type={JoinRequestType}
                />
              ))}
              <Row className="mt-4">
                <Col className="d-flex justify-content-center">
                  <Paginate
                    currentPage={joinRequestPage}
                    totalPages={totalJoinRequestPages}
                    onPageChange={setJoinRequestPage}
                  />
                </Col>
              </Row>
            </>
          ) : (
            <p>No join community requests.</p>
          )}
        </Col>

        {/* Creation Requests (only for admin) */}
        {isAdmin && (
          <Col md={4}>
            <h4>New Community Requests</h4>
            {paginatedCreationRequests.length > 0 ? (
              <>
                <div className="panel">
                  {paginatedCreationRequests.map((request) => (
                    <CreateCommunityRequestCard
                      key={request.id}
                      requestId={request.id}
                      communityName={request.communityName}
                      communityDescription={request.communityDescription}
                      userId={request.userId}
                      causeTitle={request.causeTitle}
                      causeDescription={request.causeDescription}
                      causeEndDate={request.causeEndDate}
                      causeOds={request.causeOds}
                    />
                  ))}
                </div>
                <Row className="mt-4">
                  <Col className="d-flex justify-content-center">
                    <Paginate
                      currentPage={creationRequestPage}
                      totalPages={totalCreationRequestPages}
                      onPageChange={setCreationRequestPage}
                    />
                  </Col>
                </Row>
              </>
            ) : (
              <p>No pending creation requests.</p>
            )}
          </Col>
        )}
      </Row>
    </Container>
  );
}
