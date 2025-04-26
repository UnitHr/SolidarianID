import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Community } from '../services/community.service';

export function CommunityCard({ id, name, description }: Community) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!id) {
      console.error('No ID found for community:', { id, name, description });
      return;
    }
    navigate(`/communities/${id}`);
  };

  return (
    <Card className="h-100 shadow-sm" style={{ transition: 'transform 0.2s' }}>
      <Card.Body className="d-flex flex-column p-3">
        <Card.Title className="fs-5 mb-2">{name}</Card.Title>
        <Card.Text className="text-muted small flex-grow-1">{description}</Card.Text>
        <div className="d-grid mt-2">
          <Button variant="secondary" size="sm" onClick={handleClick}>
            See details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
