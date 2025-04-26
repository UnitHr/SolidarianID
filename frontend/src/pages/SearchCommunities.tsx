import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Image } from 'react-bootstrap';
import { CommunityCard } from '../components/CommunityCard';
import { Paginate } from '../components/Pagination';
import { fetchCommunities, Community } from '../services/community.service';
import searchImage from '../assets/filter-communities-image-2.png';

export function SearchCommunities() {
  const [name, setName] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCommunities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadCommunities = async () => {
    try {
      const data = await fetchCommunities(page, 10, name);
      setCommunities(data.data);
      setTotalPages(data.meta.totalPages);
      setError('');
    } catch (err) {
      console.error('Error loading communities:', err);
      setError('Could not load communities. Please try again later.');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset to the first page when searching
    setPage(1);
    await loadCommunities();
  };

  return (
    <Container className="py-5">
      <Row className="align-items-center mb-5">
        {/* Image */}
        <Col md={6} className="mb-4 mb-md-0 text-center">
          <Image
            src={searchImage}
            fluid
            className="rounded-3 shadow-sm"
            style={{ maxHeight: '350px', objectFit: 'cover' }}
          />
        </Col>

        {/* Title and form */}
        <Col md={6}>
          <h1 className="fw-bold mb-3">Explore Communities</h1>
          <p className="text-muted mb-4">Discover and support initiatives that matter to you.</p>
          <Form onSubmit={handleSearch}>
            <Form.Group controlId="searchCommunity" className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Search by name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button type="submit" variant="secondary">
                Search
              </Button>
            </Form.Group>
          </Form>
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

      {/* Comunities */}
      <Row className="g-4">
        {communities.length > 0 ? (
          communities.map((community) => (
            <Col key={community.id} xs={12} md={6} lg={4}>
              <CommunityCard
                id={community.id}
                name={community.name}
                description={community.description}
              />
            </Col>
          ))
        ) : (
          <Col className="text-center text-muted py-5">
            <p>No communities found.</p>
          </Col>
        )}
      </Row>

      {/* Paginate */}
      <Row className="mt-4">
        <Col className="d-flex justify-content-center">
          <Paginate
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </Col>
      </Row>
    </Container>
  );
}
