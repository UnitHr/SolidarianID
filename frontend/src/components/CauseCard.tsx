import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { CauseValues } from '../pages/SearchCauses';

export function CauseCard(props: CauseValues) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!props.id) {
      console.error('No ID found for cause', props);
      return;
    }

    navigate(`/causes/${props.id}`);
  };

  return (
    <>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>{props.title}</Card.Title>
          <Card.Text>{props.description}</Card.Text>
          <Button variant="primary" onClick={handleClick}>
            See details
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}
