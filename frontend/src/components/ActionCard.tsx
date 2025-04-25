import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ActionValues } from '../pages/SearchActions';

export function ActionCard(props: ActionValues) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!props.id) {
      console.error('No ID found for actions', props);
      return;
    }

    navigate(`/actions/${props.id}`);
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
