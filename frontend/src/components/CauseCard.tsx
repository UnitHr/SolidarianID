import { Button, Card } from "react-bootstrap";

interface CauseCardProps {
  name: string;
  description: string;
}

export function CauseCard(props: CauseCardProps) {
  return (
    <>
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>{props.name}</Card.Title>
          <Card.Text>{props.description}</Card.Text>
          <Button variant="primary">Go to the cause</Button>
        </Card.Body>
      </Card>
    </>
  );
}
