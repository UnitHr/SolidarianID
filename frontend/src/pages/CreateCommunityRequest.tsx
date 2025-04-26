import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Row, Form, Card } from 'react-bootstrap';
import { createCommunityRequest } from '../services/community.service';
import { getStoredUser } from '../services/user.service';
import { OdsDropdown } from '../components/OdsDropdown';
import { ODSEnum } from '../utils/ods';

export function CreateCommunityRequest() {
  const navigate = useNavigate();
  const [selectedOds, setSelectedOds] = useState<ODSEnum[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    if (!getStoredUser()) {
      navigate('/login');
      return;
    }

    const communityName = (document.getElementById('communityName') as HTMLInputElement).value;
    const communityDescription = (
      document.getElementById('communityDescription') as HTMLTextAreaElement
    ).value;
    const causeTitle = (document.getElementById('causeTitle') as HTMLInputElement).value;
    const causeDescription = (document.getElementById('causeDescription') as HTMLTextAreaElement)
      .value;
    const causeEndDate = (document.getElementById('causeEndDate') as HTMLInputElement).value;

    if (
      !communityName ||
      !communityDescription ||
      !causeTitle ||
      !causeDescription ||
      !causeEndDate ||
      selectedOds.length === 0
    ) {
      alert('Please complete all fields and select at least one ODS.');
      return;
    }

    try {
      // Service call to create community request
      await createCommunityRequest({
        name: communityName,
        description: communityDescription,
        cause: {
          title: causeTitle,
          description: causeDescription,
          end: new Date(causeEndDate).toISOString(),
          ods: selectedOds,
        },
      });
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
            <Button variant="secondary" type="submit" className="px-5">
              Submit Request
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
