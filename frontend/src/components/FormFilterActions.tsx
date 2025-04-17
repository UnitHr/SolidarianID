import { Card, Form, Row, Button, Col } from "react-bootstrap";

export function FormFilterActions() {
  return (
    <>
      <Card className="p-4 shadow-sm mb-4" bg="light" border="primary">
        <Card.Body>
          <Card.Title className="mb-5">
            <h2>Filtering Options</h2>
          </Card.Title>
          <Form>
            <Row className="my-3">
              <Col>
                <Form.Group controlId="filterCommunity">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="community" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Label>Sort by</Form.Label>
                <Form.Select>
                  <option value="sortByTitle">By title</option>
                  <option value="sortByCreation">By creation</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Label>Sort direction</Form.Label>
                <Form.Select>
                  <option value="sortDirectionAsc">Ascending</option>
                  <option value="sortDirectionDesc">Descending</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="my-4 mx-2">
              <Col>
                <Form.Label>Status</Form.Label>
                <Form.Select>
                  <option value="statusPending">Pending</option>
                  <option value="statusInProgress">In progress</option>
                  <option value="statusCompleted">Completed</option>
                </Form.Select>
              </Col>
              <Col>
                <Row className="mt-4 px-3">
                  <Button variant="primary">Search</Button>
                </Row>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
