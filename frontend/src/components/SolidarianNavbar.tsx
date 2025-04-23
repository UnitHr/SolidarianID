import { Navbar, Nav } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';

export function SolidarianNavbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      const fullName = `${userData.firstName} ${userData.lastName}`;
      setUsername(fullName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUsername('');
    navigate('/');
  };

  return (
    <>
      <Navbar bg="primary" data-bs-theme="dark">
        <Navbar.Brand href="/" className="px-3">
          SolidarianId
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/communities">Communities</Nav.Link>
          <Nav.Link href="/causes">Causes</Nav.Link>
          <Nav.Link href="/actions">Actions</Nav.Link>
        </Nav>
        <Nav className="mx-4">
          <Nav.Link href="/notifications" className="d-flex align-items-center">
            <FaBell size={20} /> {/* Ícono de campanita */}
          </Nav.Link>
          {!isAuthenticated ? (
            <>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Register</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link href="/profile">{username}</Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar>
    </>
  );
}
