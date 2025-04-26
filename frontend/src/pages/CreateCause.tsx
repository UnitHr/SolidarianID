import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Container, Row, Form, Card } from 'react-bootstrap';
import { ODSEnum } from '../utils/ods';
import { OdsDropdown } from '../components/OdsDropdown';
import { createCause } from '../services/cause.service';
import { getStoredUser } from '../services/user.service';

export function CreateCause() {
  const navigate = useNavigate();
  const { communityId } = useParams();
  const [selectedOds, setSelectedOds] = useState<ODSEnum[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    if (!getStoredUser()) {
      navigate('/login');
      return;
    }

    const title = (document.getElementById('causeTitle') as HTMLInputElement).value;
    const description = (document.getElementById('causeDescription') as HTMLTextAreaElement).value;
    const endDate = (document.getElementById('causeEndDate') as HTMLInputElement).value;

    if (!title || !description || !endDate || selectedOds.length === 0) {
      alert('Please complete all fields and select at least one ODS.');
      return;
    }

    try {
      // Service call to create cause
      await createCause(communityId!, {
        title,
        description,
        end: new Date(endDate).toISOString(),
        ods: selectedOds,
      });

      alert('Cause created successfully!');
      navigate(`/communities/${communityId}`);
    } catch (error) {
      console.error(error);
      alert('Failed to create cause. Please try again.');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center mb-4">
        <Col md={8} lg={6}>
          <h1 className="text-center fw-bold">Create Cause</h1>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="p-4 shadow-sm">
            <Card.Body>
              {/* Form */}
              <Form onSubmit={handleSubmit}>
                <h5 className="fw-semibold mb-3">Cause Information</h5>

                <Form.Group className="mb-3" controlId="causeTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control type="text" placeholder="Enter cause title" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="causeDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
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

                {/* Submit Button */}
                <Row className="mt-4">
                  <Col className="d-flex justify-content-center">
                    <Button variant="secondary" type="submit" className="px-5">
                      Submit Cause
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
