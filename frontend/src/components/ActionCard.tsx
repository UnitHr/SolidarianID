import { Button, Card } from 'react-bootstrap';
import { ActionValues } from '../pages/SearchActions';

export function ActionCard(props: ActionValues) {
  return (
    <>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>{props.title}</Card.Title>
          <Card.Text>{props.description}</Card.Text>
          <Button variant="primary">See details</Button>
        </Card.Body>
      </Card>
    </>
  );
}
