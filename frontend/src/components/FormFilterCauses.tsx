import { Card, Form, Row, Button } from "react-bootstrap";

export function FormFilterCauses() {
  <>
    <Card className="p-4 shadow-sm mb-4">
      <Card.Body>
        <Card.Title className="mb-4">
          <h2>Filter Causes</h2>
        </Card.Title>
        <Form>
          <Row className="g-3">
            <Form.Group controlId="filterCommunity">
              <Form.Label>Filter Causes</Form.Label>
              <Form.Control
                type="text"
                placeholder="Keyword"
                name="community"
              />
            </Form.Group>
          </Row>
          <Row className="my-4 mx-2">
            <Button variant="secondary">Search</Button>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  </>;
}
