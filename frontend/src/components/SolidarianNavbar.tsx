import { Navbar, Nav } from "react-bootstrap";

export function SolidarianNavbar() {
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
          <Nav.Link href="/login">Login</Nav.Link>
          <Nav.Link href="/register">Register</Nav.Link>
        </Nav>
      </Navbar>
    </>
  );
}
