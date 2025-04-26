import { Col, Container, Row, Image, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import girlImage from '../assets/chica-solidarianid.png';

export function Home() {
  const navigate = useNavigate();

  return (
    <Container className="py-5">
      {/* Top section */}
      <Row className="align-items-center mb-5">
        <Col md={6} className="text-center text-md-start mb-4 mb-md-0">
          <h2 className="fw-bold">Empower Communities</h2>
          <p className="text-muted mt-3">
            Discover, support, and engage with causes and actions that matter.
          </p>
        </Col>
        <Col md={6} className="text-center">
          <Image src={girlImage} fluid style={{ maxHeight: '400px', objectFit: 'cover' }} />
        </Col>
      </Row>

      {/* Cards */}
      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100 text-center">
            <Card.Body>
              <Card.Title>Communities</Card.Title>
              <Card.Text>
                Join communities that align with your passions and make an impact.
              </Card.Text>
              <Button variant="secondary" onClick={() => navigate('/communities')}>
                Explore Communities
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 text-center">
            <Card.Body>
              <Card.Title>Causes</Card.Title>
              <Card.Text>
                Discover meaningful causes and contribute where it matters the most.
              </Card.Text>
              <Button variant="secondary" onClick={() => navigate('/causes')}>
                Explore Causes
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 text-center">
            <Card.Body>
              <Card.Title>Actions</Card.Title>
              <Card.Text>Take action and be part of initiatives that drive real change.</Card.Text>
              <Button variant="secondary" onClick={() => navigate('/actions')}>
                Explore Actions
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
