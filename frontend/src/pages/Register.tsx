import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Container, Form, Row, Spinner, Alert } from 'react-bootstrap';
import { useRegisterUser } from '../lib/hooks/useUser';

export function Register() {
  const navigate = useNavigate();
  const { registerUser, loading } = useRegisterUser();
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    birthDate: '',
    bio: '',
    showAge: false,
    showEmail: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const type = e.target.type;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationError(null);

    try {
      await registerUser(formData);
      navigate('/login');
    } catch (error) {
      setRegistrationError(error instanceof Error ? error.message : 'Error during registration');
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={5}>
          <Card className="shadow-sm border-primary" bg="light">
            <Card.Body>
              <h2 className="text-center mb-4">Register</h2>

              {registrationError && <Alert variant="danger">{registrationError}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your first name"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Enter your last name"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    autoComplete="email"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBirthDate">
                  <Form.Label>Birth Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBio">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us a bit about you"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-2" controlId="formShowAge">
                  <Form.Check
                    id="formShowAge"
                    type="checkbox"
                    name="showAge"
                    label="Show Age"
                    checked={formData.showAge}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formShowEmail">
                  <Form.Check
                    id="formShowEmail"
                    type="checkbox"
                    name="showEmail"
                    label="Show Email"
                    checked={formData.showEmail}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="secondary" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                        <span className="ms-2">Registering...</span>
                      </>
                    ) : (
                      'Register'
                    )}
                  </Button>
                  <Button
                    variant="dark"
                    type="button"
                    onClick={handleBackToLogin}
                    disabled={loading}
                  >
                    Back to Login
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
