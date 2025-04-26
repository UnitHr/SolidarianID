import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { ActionTypeEnum, ActionTypeLabels, CreateActionPayload } from '../lib/types/action.types';
import { getStoredUser } from '../services/user.service';
import { createAction } from '../services/cause.service';

export function CreateAction() {
  const navigate = useNavigate();

  const { causeId } = useParams();
  const [type, setType] = useState<ActionTypeEnum | ''>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: '',
    unit: '',
    goodType: '',
    location: '',
    date: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    if (!getStoredUser()) {
      navigate('/login');
      return;
    }

    if (!causeId || !type) {
      alert('Cause ID and action type are required.');
      return;
    }

    const payload: CreateActionPayload = {
      type,
      title: formData.title,
      description: formData.description,
      target: Number(formData.target),
      unit: formData.unit,
    };

    // Condicionalmente agregar los campos opcionales
    if (type === ActionTypeEnum.GOODS_COLLECTION) {
      payload.goodType = formData.goodType;
    } else if (type === ActionTypeEnum.VOLUNTEER) {
      payload.location = formData.location;
      payload.date = formData.date;
    }

    try {
      // Call service
      await createAction(causeId, payload);
      alert('Action created successfully!');
      navigate(`/causes/${causeId}`);
    } catch (error) {
      console.error(error);
      alert('Failed to create action. Please try again.');
    }
  };

  return (
    <Container className="py-5">
      {/* Título arriba */}
      <Row className="justify-content-center mb-4">
        <Col md={8} lg={6}>
          <h1 className="text-center fw-bold mb-4">Create Action</h1>
        </Col>
      </Row>

      {/* Formulario dentro del Card */}
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <h5 className="fw-semibold mb-4">Action Information</h5>

              <Form onSubmit={handleSubmit}>
                {/* Type */}
                <Form.Group className="mb-3" controlId="type">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={type}
                    onChange={(e) => setType(e.target.value as ActionTypeEnum)}
                    required
                  >
                    <option value="">Select type</option>
                    {Object.values(ActionTypeEnum).map((actionType) => (
                      <option key={actionType} value={actionType}>
                        {ActionTypeLabels[actionType]}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Title */}
                <Form.Group className="mb-3" controlId="title">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter action title"
                    required
                  />
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-3" controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter action description"
                    required
                  />
                </Form.Group>

                {/* Target */}
                <Form.Group className="mb-3" controlId="target">
                  <Form.Label>Target</Form.Label>
                  <Form.Control
                    type="number"
                    name="target"
                    value={formData.target}
                    onChange={handleInputChange}
                    placeholder="Enter target value"
                    required
                  />
                </Form.Group>

                {/* Unit */}
                <Form.Group className="mb-3" controlId="unit">
                  <Form.Label>Unit</Form.Label>
                  <Form.Control
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    placeholder="Enter unit"
                    required
                  />
                </Form.Group>

                {/* Conditional fields */}
                {type === ActionTypeEnum.GOODS_COLLECTION && (
                  <Form.Group className="mb-3" controlId="goodType">
                    <Form.Label>Good Type</Form.Label>
                    <Form.Control
                      type="text"
                      name="goodType"
                      value={formData.goodType}
                      onChange={handleInputChange}
                      placeholder="Enter type of goods"
                      required
                    />
                  </Form.Group>
                )}

                {type === ActionTypeEnum.VOLUNTEER && (
                  <>
                    <Form.Group className="mb-3" controlId="location">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Enter location"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="date">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </Form.Group>
                  </>
                )}

                {/* Submit Button */}
                <div className="d-flex justify-content-center mt-4">
                  <Button variant="secondary" type="submit" className="px-5">
                    Submit Action
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
