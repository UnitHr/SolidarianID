import Link from 'next/link';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '@/lib/context/AuthContext'; 
import { useEffect, useState } from 'react';

export function SolidarianNavbar() {
  const {logout } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const userCookie = getCookie('user');
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userCookie));
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user cookie:', error);
      }
    }
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = 'http://localhost:5173'; 
  };

  if (!isMounted) return null;

  const externalBaseUrl = "http://localhost:5173"; 

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Link href={`${externalBaseUrl}`} passHref>
          <Navbar.Brand>SolidarianID</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav className="me-auto">
            <Nav.Link as="a" href={`${externalBaseUrl}/communities`} rel="noopener noreferrer">
              Communities
            </Nav.Link>
            <Nav.Link as="a" href={`${externalBaseUrl}/causes`} rel="noopener noreferrer">
              Causes
            </Nav.Link>
            <Nav.Link as="a" href={`${externalBaseUrl}/actions`}  rel="noopener noreferrer">
              Actions
            </Nav.Link>
          </Nav>
          <Nav className="align-items-center">
            {!isAuthenticated ? (
              <>
                <Nav.Link as="a" href={`${externalBaseUrl}/login`} rel="noopener noreferrer">
                  Login
                </Nav.Link>
                <Nav.Link as="a" href={`${externalBaseUrl}/register`} rel="noopener noreferrer">
                  Register
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as="a" href={`${externalBaseUrl}/notifications`} rel="noopener noreferrer">
                  <FaBell size={18} />
                </Nav.Link>
                <NavDropdown title={<FaUserCircle size={20} />} id="user-dropdown" align="end">
                  <NavDropdown.Item as="a" href={`${externalBaseUrl}/profile`} rel="noopener noreferrer">
                    Hi, {user?.firstName}
                  </NavDropdown.Item>
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

function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

