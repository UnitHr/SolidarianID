import { Col, Container, Row } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function CreateAction() {
  const { causeId } = useParams();
  const navigate = useNavigate();
  const [type, setType] = useState('');

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

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const { token } = JSON.parse(storedUser);

    const body: any = {
      type,
      title: formData.title,
      description: formData.description,
      target: Number(formData.target),
      unit: formData.unit,
    };

    // Agregar campos opcionales según el tipo
    if (type === 'goods_collection') {
      body.goodType = formData.goodType;
    } else if (type === 'volunteer') {
      body.location = formData.location;
      body.date = formData.date;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/v1/causes/${causeId}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to create action');
      alert('Action created successfully!');
      navigate(`/causes/${causeId}`);
    } catch (error) {
      console.error(error);
      alert('Failed to create action. Please try again.');
    }
  };

  return (
    <>
      <Container>
        <Row className="my-5">
          <h1 className="text-center">Create Action</h1>
        </Row>

        <Row className="my-4">
          <Col md={{ span: 6, offset: 3 }}>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="">Select type</option>
                  <option value="economic">Economic</option>
                  <option value="goods_collection">Goods Collection</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="target" className="form-label">
                  Target
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="target"
                  name="target"
                  value={formData.target}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="unit" className="form-label">
                  Unit
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Campos adicionales según tipo de acción */}
              {type === 'goods_collection' && (
                <div className="mb-3">
                  <label htmlFor="goodType" className="form-label">
                    Good Type
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="goodType"
                    name="goodType"
                    value={formData.goodType}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              {type === 'volunteer' && (
                <>
                  <div className="mb-3">
                    <label htmlFor="location" className="form-label">
                      Location
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                      Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </>
              )}

              <button type="submit" className="btn btn-primary">
                Create Action
              </button>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
