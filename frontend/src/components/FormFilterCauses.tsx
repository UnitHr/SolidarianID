import { useState } from "react";
import { Card, Form, Row, Button, Col } from "react-bootstrap";

export function FormFilterCauses({
  name,
  ods,
  sortBy,
  sortDirection,
  changeName,
  changeOds,
  changeSortBy,
  changeSortDirection,
  handleSubmit,
}) {
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
            <Row className="my-3">
              <Form.Group controlId="filterOds">
                <Form.Label>ODS</Form.Label>
                <br />
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods1"
                  label="No Poverty"
                  checked={ods.includes("1")}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods2"
                  label="Zero Hunger"
                  checked={ods.includes("2")}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods3"
                  label="Good Health and Well-Being"
                  checked={ods.includes("3")}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods4"
                  label="Quality Education"
                  checked={ods.includes("4")}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods5"
                  label="Gender Equality"
                  checked={ods.includes("5")}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods6"
                  label="Clean Water and Sanitation"
                  checked={ods.includes("6")}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods7"
                  label="Affordable and Clean Energy"
                  checked={ods.includes("7")}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods8"
                  label="Decent Work and Economic Growth"
                  checked={ods.includes("8")}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods9"
                  label="Industry, Innovation and Infrastructure"
                  checked={ods.includes("9")}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods10"
                  label="Reduced Inequalities"
                  checked={ods.includes("10")}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods11"
                  label="Sustainable Cities and Communities"
                  checked={ods.includes("11")}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods12"
                  label="Responsible Consumption and Production"
                  checked={ods.includes("12")}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods13"
                  label="Climate Action"
                  checked={ods.includes("13")}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods14"
                  label="Life Below Water"
                  checked={ods.includes("14")}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods15"
                  label="Life on Land"
                  checked={ods.includes("15")}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods16"
                  label="Peace, Justice and Strong Institutions"
                  checked={ods.includes("16")}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods17"
                  label="Partnerships for the Goals"
                  checked={ods.includes("17")}
                  onChange={changeOds}
                ></Form.Check>
              </Form.Group>
            </Row>
            <Row className="my-4 mx-2">
              <Col></Col>
              <Col>
                <Row>
                  <Button variant="primary" onClick={handleSubmit}>
                    Search
                  </Button>
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
