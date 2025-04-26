import { Button, Col, Container, Row, Form, Card } from 'react-bootstrap';
import { useState } from 'react';
import { ODSEnum } from '../utils/ods';
import { useNavigate } from 'react-router-dom';
import { OdsDropdown } from '../components/OdsDropdown';

export function CreateCommunityRequest() {
  const navigate = useNavigate();
  const [selectedOds, setSelectedOds] = useState<ODSEnum[]>([]);

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const communityName = (document.getElementById('communityName') as HTMLInputElement).value;
    const communityDescription = (
      document.getElementById('communityDescription') as HTMLTextAreaElement
    ).value;
    const causeTitle = (document.getElementById('causeTitle') as HTMLInputElement).value;
    const causeDescription = (document.getElementById('causeDescription') as HTMLTextAreaElement)
      .value;
    const causeEndDate = (document.getElementById('causeEndDate') as HTMLInputElement).value;
    const selectedIds = Array.from(selectedOds); // Convertir el Set a Array

    // Construir el cuerpo de la solicitud
    const requestBody = {
      name: communityName,
      description: communityDescription,
      cause: {
        title: causeTitle,
        description: causeDescription,
        end: causeEndDate,
        ods: selectedIds,
      },
    };

    console.log('Request Body:', requestBody); // Para depuración

    try {
      // Enviar la solicitud al servidor
      const response = await fetch('http://localhost:3002/communities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Reemplaza con tu método para obtener el token
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      console.log('Community Request created successfully:', data);

      alert('Community Request created successfully!');

      navigate('/communities');
    } catch (error) {
      console.error(error);
      alert('Failed to create community request. Please try again.');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-4">
        <Col md={10}>
          <h1 className="text-center fw-bold">Create Community Request</h1>
        </Col>
      </Row>

      <Form onSubmit={handleSubmit}>
        <Row className="g-4 justify-content-center">
          {/* Community Info */}
          <Col md={6}>
            <Card className="h-100 shadow-sm p-3">
              <Card.Body>
                <h5 className="fw-semibold mb-3">Community Info</h5>

                <Form.Group className="mb-3" controlId="communityName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter community name" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="communityDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter community description"
                    required
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          {/* Cause Info */}
          <Col md={6}>
            <Card className="h-100 shadow-sm p-3">
              <Card.Body>
                <h5 className="fw-semibold mb-3">Initial Cause</h5>

                <Form.Group className="mb-3" controlId="causeTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" placeholder="Enter cause title" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="causeDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Enter cause description"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="causeEndDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control type="date" min={new Date().toISOString().split('T')[0]} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>ODS (Select at least one)</Form.Label>
                  <OdsDropdown selected={selectedOds} onChange={setSelectedOds} />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Submit Button */}
        <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <Button variant="primary" type="submit" className="px-5">
              Submit Request
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
