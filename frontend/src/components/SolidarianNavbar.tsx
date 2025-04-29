import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Badge } from 'react-bootstrap';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState, useCallback } from 'react';
import { useNotificationSubscription } from '../lib/hooks/useNotification';

export function SolidarianNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const isNotificationsPage = location.pathname === '/notifications';

  const handleNotificationReceived = useCallback(() => {
    if (isNotificationsPage) {
      window.location.reload();
      return;
    }

    setNotificationCount((prevCount) => {
      const newCount = prevCount + 1;
      if (user) {
        localStorage.setItem(`notifications_${user.userId}`, newCount.toString());
      }
      return newCount;
    });
  }, [isNotificationsPage, user]);

  // Handler for notification subscription errors
  const handleSubscriptionError = useCallback((error: Error) => {
    console.error('Error in notification subscription:', error);
  }, []);

  // Use hook for notification subscriptions
  useNotificationSubscription(
    user?.userId || '',
    handleNotificationReceived,
    handleSubscriptionError
  );

  useEffect(() => {
    if (isAuthenticated && user) {
      const savedCount = localStorage.getItem(`notifications_${user.userId}`);
      if (savedCount && !isNotificationsPage) {
        setNotificationCount(parseInt(savedCount, 10));
      } else if (isNotificationsPage) {
        setNotificationCount(0);
        localStorage.setItem(`notifications_${user.userId}`, '0');
      }
    }
  }, [isAuthenticated, user, isNotificationsPage]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Reset notification count when visiting notifications page
  const handleNotificationClick = () => {
    setNotificationCount(0);
    if (user) {
      localStorage.setItem(`notifications_${user.userId}`, '0');
    }
    navigate('/notifications');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/">SolidarianID</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/communities">
              Communities
            </Nav.Link>
            <Nav.Link as={NavLink} to="/causes">
              Causes
            </Nav.Link>
            <Nav.Link as={NavLink} to="/actions">
              Actions
            </Nav.Link>
          </Nav>
          <Nav className="align-items-center">
            {!isAuthenticated ? (
              <>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link onClick={handleNotificationClick} className="position-relative">
                  <FaBell size={18} />
                  {!isNotificationsPage && notificationCount > 0 && (
                    <Badge
                      pill
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle"
                      style={{ fontSize: '0.6rem' }}
                    >
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </Badge>
                  )}
                </Nav.Link>
                <NavDropdown title={<FaUserCircle size={20} />} id="user-dropdown" align="end">
                  <NavDropdown.Item href="/profile">Hi, {user?.firstName}</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
