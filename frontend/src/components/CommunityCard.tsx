import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CommunityValues } from '../pages/SearchCommunities';

export function CommunityCard(props: CommunityValues) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!props.id) {
      console.error('No ID found for communities', props);
      return;
    }

    navigate(`/communities/${props.id}`);
  };

  return (
    <>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>{props.name}</Card.Title>
          <Card.Text>{props.description}</Card.Text>
          <Button variant="primary" onClick={handleClick}>
            See details
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}
