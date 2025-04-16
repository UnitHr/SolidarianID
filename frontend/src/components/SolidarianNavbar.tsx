import { Navbar, Nav } from "react-bootstrap";

export function SolidarianNavbar() {
  return (
    <>
      <Navbar bg="primary" data-bs-theme="dark">
        <Navbar.Brand href="#home" className="px-3">
          SolidarianId
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="#home">Communities</Nav.Link>
          <Nav.Link href="#features">Causes</Nav.Link>
          <Nav.Link href="#pricing">Actions</Nav.Link>
        </Nav>
        <Nav className="mx-4">
          <Nav.Link href="#login">Login</Nav.Link>
          <Nav.Link href="#register">Register</Nav.Link>
        </Nav>
      </Navbar>
    </>
  );
}
