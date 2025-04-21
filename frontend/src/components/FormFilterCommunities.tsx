import { Card, Form, Row, Button } from "react-bootstrap";

export function FormFilterCommunities({ name, changeName, handleSearch }) {
  return (
    <>
      <Card border="primary" bg="light" className="p-4 shadow-sm mb-4">
        <Card.Body>
          <Card.Title className="mb-4">
            <h2>Filtering Options</h2>
          </Card.Title>
          <Form>
            <Row className="g-3">
              <Form.Group controlId="filterCommunity">
                <Form.Label>Community name</Form.Label>
                <Form.Control
                  type="text"
                  name="community"
                  value={name}
                  onChange={changeName}
                />
              </Form.Group>
            </Row>
            <Row className="my-4 mx-2">
              <Button variant="primary" type="submit" onClick={handleSearch}>
                Search
              </Button>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
