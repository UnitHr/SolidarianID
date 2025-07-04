import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface CauseCardProps {
  id: string;
  title: string;
  description: string;
}

export function CauseCard({ id, title, description }: CauseCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!id) {
      console.error('No ID found for cause:', { id, title, description });
      return;
    }
    //window.location.href = `http://localhost:3006/causes/${id}`;
    navigate(`/causes/${id}`);
  };

  return (
    <Card className="h-100 shadow-sm" style={{ transition: 'transform 0.2s' }}>
      <Card.Body className="d-flex flex-column p-3">
        <Card.Title className="fs-5 mb-2">{title}</Card.Title>
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
