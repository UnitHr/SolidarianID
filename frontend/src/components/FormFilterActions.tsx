import { Card, Form, Row, Button, Col } from "react-bootstrap";

export function FormFilterActions({
  name,
  sortBy,
  sortDirection,
  status,
  changeName,
  changeSortBy,
  changeSortDirection,
  changeStatus,
  handleSearch,
}: any) {
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
                  <Form.Control
                    type="text"
                    name="community"
                    value={name}
                    onChange={changeName}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Label>Sort by</Form.Label>
                <Form.Select value={sortBy} onChange={changeSortBy}>
                  <option value="title">By title</option>
                  <option value="createdAt">By creation</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Label>Sort direction</Form.Label>
                <Form.Select
                  value={sortDirection}
                  onChange={changeSortDirection}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="my-4 mx-2">
              <Col>
                <Form.Label>Status</Form.Label>
                <Form.Select value={status} onChange={changeStatus}>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="COMPLETED">Completed</option>
                </Form.Select>
              </Col>
              <Col>
                <Row className="mt-4 px-3">
                  <Button variant="primary" onClick={handleSearch}>
                    Search
                  </Button>
                </Row>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
