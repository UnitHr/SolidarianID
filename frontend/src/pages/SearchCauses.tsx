import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Image, Alert } from 'react-bootstrap';
import { fetchCauses } from '../services/cause.service';
import { OdsDropdown } from '../components/OdsDropdown';
import { Paginate } from '../components/Pagination';
import { CauseCard } from '../components/CauseCard';
import { ODSEnum } from '../utils/ods';
import searchCausesImage from '../assets/filter-causes-image.png';
import { CauseDetails } from '../lib/types/cause.types';

export function SearchCauses() {
  const [name, setName] = useState('');
  const [selectedOds, setSelectedOds] = useState<ODSEnum[]>([]);
  const [sortBy, setSortBy] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

  const [causes, setCauses] = useState<CauseDetails[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [error, setError] = useState('');

  useEffect(() => {
    loadCauses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadCauses();
  };

  const loadCauses = async () => {
    try {
      const data = await fetchCauses(page, 9, name, selectedOds, sortBy, sortDirection);
      setCauses(data.data);
      setTotalPages(data.meta.totalPages);
      setError('');
    } catch (err) {
      console.error('Error fetching causes:', err);
      setCauses([]);
      setTotalPages(0);
      setError('Failed to load causes. Try again later.');
    }
  };

  return (
    <Container className="py-5">
      {/* Header */}
      <Row className="align-items-start mb-5">
        {/* Image left */}
        <Col md={6} className="text-center mb-4 mb-md-0">
          <Image
            src={searchCausesImage}
            alt="Explore Causes"
            fluid
            style={{ maxHeight: '350px', objectFit: 'cover' }}
          />
        </Col>

        {/* Title and filters options rigth */}
        <Col md={6}>
          <h1 className="fw-bold mb-2">Explore Causes</h1>
          <p className="text-muted mb-4">
            Discover and support social initiatives that matter to you.
          </p>

          <Card className="shadow-sm p-4">
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                {/* Name */}
                <Col md={6}>
                  <Form.Group controlId="searchName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter cause name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                {/* ODS */}
                <Col md={6}>
                  <Form.Group controlId="odsDropdown">
                    <Form.Label>ODS (Select one or more)</Form.Label>
                    <OdsDropdown selected={selectedOds} onChange={setSelectedOds} />
                  </Form.Group>
                </Col>
              </Row>

              <hr className="my-4" />

              <Row className="g-3">
                {/* Sort By */}
                <Col md={6}>
                  <Form.Group controlId="sortBy">
                    <Form.Label>Sort By</Form.Label>
                    <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="title">By Title</option>
                      <option value="createdAt">By Date Created</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Sort Direction */}
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
                <Button variant="primary" type="submit">
                  Search
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      <hr className="my-4" />

      {/* Causes */}
      <Row className="g-4">
        {causes.length > 0 ? (
          causes.map((cause) => (
            <Col key={cause.id} xs={12} md={6} lg={4}>
              <CauseCard {...cause} />
            </Col>
          ))
        ) : (
          <Col className="text-center text-muted py-5">
            <p>No causes found.</p>
          </Col>
        )}
      </Row>

      {/* Pagination */}
      {causes.length > 0 && (
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
