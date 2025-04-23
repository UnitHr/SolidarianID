import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface CommunityCardProps {
  id: string;
  name: string;
  description: string;
}

export function CommunityCard(props: CommunityCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/communities/${props.id}`);
  };

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
        <Card.Text>{props.description}</Card.Text>
        <Button variant="primary" onClick={handleClick}>
          Go to the community
        </Button>
      </Card.Body>
    </Card>
  );
}
