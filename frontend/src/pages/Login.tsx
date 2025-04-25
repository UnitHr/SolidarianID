import { useState } from 'react';
import { Button, Col, Container, Form, Row, Card } from 'react-bootstrap';
import { SolidarianNavbar } from '../components/SolidarianNavbar';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    try {
      const response = await fetch('http://localhost:3000/api/v1/users/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const playload = jwtDecode<{
          email: string;
          sub: { value: string };
          roles: string;
          exp: number;
        }>(data.access_token);

        const userId = playload.sub?.value;
        if (!userId) {
          alert('Invalid user');
          return;
        }
        const userResponse = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.access_token}`,
          },
        });

        if (userResponse.ok) {
          const userResponseData = await userResponse.json();

          const userData = {
            userId: userId,
            firstName: userResponseData.firstName,
            lastName: userResponseData.lastName,
            roles: playload.roles,
            token: data.access_token,
            exp: playload.exp,
          };

          localStorage.setItem('user', JSON.stringify(userData));
        }

        localStorage.setItem('token', data.access_token);
        navigate('/');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error during login');
    }
  };

  const handleRegister = () => {
    window.location.href = '/register';
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
                  <h2>Login</h2>
                </Card.Title>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit">
                      Login
                    </Button>
                    <Button variant="dark" type="button" onClick={handleRegister} className="mt-3">
                      Create an account
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
