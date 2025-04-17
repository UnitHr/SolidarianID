import { Button, Card } from "react-bootstrap";

interface ActionCardProps {
  name: string;
  description: string;
}

export function ActionCard(props: ActionCardProps) {
  return (
    <>
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>{props.name}</Card.Title>
          <Card.Text>{props.description}</Card.Text>
          <Button variant="primary">See the action</Button>
        </Card.Body>
      </Card>
    </>
  );
}
