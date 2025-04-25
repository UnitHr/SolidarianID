import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../lib/hooks/useAuth';

export function SolidarianNavbar() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand href="/">SolidarianID</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav className="me-auto">
            <Nav.Link href="/communities">Communities</Nav.Link>
            <Nav.Link href="/causes">Causes</Nav.Link>
            <Nav.Link href="/actions">Actions</Nav.Link>
          </Nav>
          <Nav className="align-items-center">
            {!isAuthenticated ? (
              <>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/notifications">
                  <FaBell size={18} />
                </Nav.Link>
                <NavDropdown title={<FaUserCircle size={20} />} id="user-dropdown" align="end">
                  <NavDropdown.Item href="/profile">Hi, {username}</NavDropdown.Item>
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
