import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Image } from 'react-bootstrap';
import { ActionDetails, ActionStatusEnum, ActionStatusLabels } from '../lib/types/action.types';
import { fetchActions } from '../services/action.service';
import { Paginate } from '../components/Pagination';
import { ActionCard } from '../components/ActionCard';
import searchActionsImage from '../assets/filter-actions-image.png';

export function SearchActions() {
  const [actions, setActions] = useState<ActionDetails[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

  const [error, setError] = useState('');

  useEffect(() => {
    loadActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    loadActions();
  };

  const loadActions = async () => {
    try {
      // Call Service
      const response = await fetchActions(page, 9, name, status, sortBy, sortDirection);
      setActions(response.data);
      setTotalPages(response.meta.totalPages);
      setError('');
    } catch (err) {
      console.error('Error loading actions:', err);
      setActions([]);
      setTotalPages(0);
      setError('Failed to load actions. Please try again later.');
    }
  };

  return (
    <Container className="py-5">
      {/* Error Alert */}
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      {/* Header */}
      <Row className="align-items-center mb-5">
        {/* Left Column: Text + Filter */}
        <Col md={6}>
          <h1 className="fw-bold mb-2">Explore Actions</h1>
          <p className="text-muted">
            Find meaningful actions you can contribute to. Whether it's volunteering, donating, or
            spreading awareness — every action counts.
          </p>

          {/* Filter Card */}
          <Card className="shadow-sm p-4 mt-4">
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="searchName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter action name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="status">
                    <Form.Label>Status</Form.Label>
                    <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="">All</option>
                      {Object.values(ActionStatusEnum).map((statusValue) => (
                        <option key={statusValue} value={statusValue}>
                          {ActionStatusLabels[statusValue]}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <hr className="my-4" />

              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="sortBy">
                    <Form.Label>Sort By</Form.Label>
                    <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="title">By Title</option>
                      <option value="createdAt">By Creation Date</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="sortDirection">
                    <Form.Label>Sort Direction</Form.Label>
                    <Form.Select
                      value={sortDirection}
                      onChange={(e) => setSortDirection(e.target.value)}
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-center mt-4">
                <Button type="submit" variant="primary">
                  Search
                </Button>
              </div>
            </Form>
          </Card>
        </Col>

        {/* Right Column: Image */}
        <Col md={6} className="text-center">
          <Image
            src={searchActionsImage}
            alt="Explore Actions"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        </Col>
      </Row>

      <hr className="my-4" />

      {/* Actions */}
      <Row className="g-4">
        {actions.length > 0 ? (
          actions.map((action) => (
            <Col key={action.id} xs={12} md={6} lg={4}>
              <ActionCard {...action} />
            </Col>
          ))
        ) : (
          <Col className="text-center text-muted py-5">
            <p>No actions found.</p>
          </Col>
        )}
      </Row>

      {/* Pagination */}
      {actions.length > 0 && (
        <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <Paginate
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
}
