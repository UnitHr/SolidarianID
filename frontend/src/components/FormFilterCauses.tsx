import { Card, Form, Row, Button, Col } from "react-bootstrap";

export function FormFilterCauses() {
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
            <Row className="my-3">
              <Form.Group controlId="filterOds">
                <Form.Label>ODS</Form.Label>
                <br />
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods1"
                  label="No Poverty"
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods2"
                  label="Zero Hunger"
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods3"
                  label="Good Health and Well-Being"
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods4"
                  label="Quality Education"
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods5"
                  label="Gender Equality"
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods6"
                  label="Clean Water and Sanitation"
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods7"
                  label="Affordable and Clean Energy"
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods8"
                  label="Decent Work and Economic Growth"
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods9"
                  label="Industry, Innovation and Infrastructure"
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods10"
                  label="Reduced Inequalities"
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods11"
                  label="Sustainable Cities and Communities"
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods12"
                  label="Responsible Consumption and Production"
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods13"
                  label="Climate Action"
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods14"
                  label="Life Below Water"
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods15"
                  label="Life on Land"
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods16"
                  label="Peace, Justice and Strong Institutions"
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods17"
                  label="Partnerships for the Goals"
                ></Form.Check>
              </Form.Group>
            </Row>
            <Row className="my-4 mx-2">
              <Col></Col>
              <Col>
                <Row>
                  <Button variant="primary">Search</Button>
                </Row>
              </Col>
              <Col></Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
