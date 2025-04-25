import { Col, Container, Row } from 'react-bootstrap';
import { SolidarianNavbar } from '../components/SolidarianNavbar';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { odsData, ODSEnum } from '../utils/ods';

export function CreateCause() {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [selectedOds, setSelectedOds] = useState<Set<ODSEnum>>(new Set());

  const handleCheckboxChange = (id: ODSEnum) => {
    setSelectedOds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id); // Deseleccionar
      } else {
        newSet.add(id); // Seleccionar
      }
      return newSet;
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const causeTitle = (document.getElementById('causeTitle') as HTMLInputElement).value;
    const causeDescription = (document.getElementById('causeDescription') as HTMLTextAreaElement)
      .value;
    const causeEndDate = (document.getElementById('causeEndDate') as HTMLInputElement).value;
    const selectedIds = Array.from(selectedOds);

    if (!causeTitle || !causeDescription || !causeEndDate || selectedIds.length === 0) {
      alert('Please complete all fields and select at least one ODS.');
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const { token } = JSON.parse(storedUser);

    const requestBody = {
      title: causeTitle,
      description: causeDescription,
      end: new Date(causeEndDate).toISOString(),
      ods: selectedIds,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/communities/${communityId}/causes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      console.log('Cause created successfully:', data);

      alert('Cause created successfully!');
      navigate(`/communities/${communityId}`);
    } catch (error) {
      console.error(error);
      alert('Failed to create cause. Please try again.');
    }
  };

  return (
    <>
      <SolidarianNavbar />
      <Container>
        <Row className="my-5">
          <h1 className="text-center">Create a New Cause</h1>
        </Row>

        <Row className="my-4">
          <Col md={{ span: 6, offset: 3 }}>
            <form>
              <div className="mb-3">
                <label htmlFor="causeTitle" className="form-label">
                  Cause Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="causeTitle"
                  placeholder="Enter cause title"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="causeDescription" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="causeDescription"
                  placeholder="Enter cause description"
                  rows={3}
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="causeEndDate" className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="causeEndDate"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="causeOds" className="form-label">
                  ODS (Select at least one)
                </label>
                <div id="causeOds">
                  {Object.values(odsData).map((ods) => (
                    <div className="form-check" key={ods.id}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`ods${ods.id}`}
                        value={ods.id}
                        onChange={() => handleCheckboxChange(ods.id)}
                      />
                      <label className="form-check-label" htmlFor={`ods${ods.id}`}>
                        {ods.title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                Submit
              </button>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
