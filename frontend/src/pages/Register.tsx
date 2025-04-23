import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { SolidarianNavbar } from "../components/SolidarianNavbar";
import { useLocation, useNavigate } from "react-router-dom";

export function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const isGithubRegistration = location.state?.isGithubRegistration;
  const githubId = location.state?.githubId;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthDate: "",
    bio: "",
    showAge: false,
    showEmail: false,
    githubId: githubId || null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          birthDate: new Date(formData.birthDate),
        }),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        const error = await response.json();
        alert(error.message || "Error during registration");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error during registration");
    }
  };

  return (
    <>
      <SolidarianNavbar />
      <Container>
        <Row className="justify-content-md-center my-4">
          <Col md={6}>
            <Card className="p-4 shadow-sm" bg="light" border="primary">
              <Card.Body>
                <Card.Title className="text-center mb-4">
                  <h2>{isGithubRegistration ? "Complete GitHub Registration" : "Register"}</h2>
                </Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  {!isGithubRegistration && (
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  )}
                  <Form.Group className="mb-3">
                    <Form.Label>Birth Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="showAge"
                      label="Show Age"
                      checked={formData.showAge}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      name="showEmail"
                      label="Show Email"
                      checked={formData.showEmail}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <div className="d-grid">
                    <Button variant="primary" type="submit">
                      Register
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}