import { useState } from 'react';
import { Card, Form, Row, Button, Col, Image } from 'react-bootstrap';
import ods1 from '../assets/ods/goal-1.png';
import ods2 from '../assets/ods/goal-2.png';
import ods3 from '../assets/ods/goal-3.png';
import ods4 from '../assets/ods/goal-4.png';
import ods5 from '../assets/ods/goal-5.png';
import ods6 from '../assets/ods/goal-6.png';
import ods7 from '../assets/ods/goal-7.png';
import ods8 from '../assets/ods/goal-8.png';
import ods9 from '../assets/ods/goal-9.png';
import ods10 from '../assets/ods/goal-10.png';
import ods11 from '../assets/ods/goal-11.png';
import ods12 from '../assets/ods/goal-12.png';
import ods13 from '../assets/ods/goal-13.png';
import ods14 from '../assets/ods/goal-14.png';
import ods15 from '../assets/ods/goal-15.png';
import ods16 from '../assets/ods/goal-16.png';
import ods17 from '../assets/ods/goal-17.png';

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
            <Row className="my-5">
              <Col>
                <Form.Group controlId="filterCommunity">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="community" value={name} onChange={changeName} />
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
                <Form.Select value={sortDirection} onChange={changeSortDirection}>
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="my-4">
              <Form.Group controlId="filterOds" className="d-flex flex-wrap gap-3">
                <Form.Label>ODS</Form.Label>
                <br />
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods1"
                  label={
                    <Image
                      src={ods1}
                      className="img-fluid"
                      style={{ width: '150px', borderRadius: '8px' }}
                    />
                  }
                  checked={ods.includes('1')}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods2"
                  label={
                    <Image
                      src={ods2}
                      className="img-fluid"
                      style={{ width: '150px', borderRadius: '8px' }}
                    />
                  }
                  checked={ods.includes('2')}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods3"
                  label={
                    <Image
                      src={ods3}
                      className="img-fluid"
                      style={{ width: '150px', borderRadius: '8px' }}
                    />
                  }
                  checked={ods.includes('3')}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods4"
                  label={
                    <Image
                      src={ods4}
                      className="img-fluid"
                      style={{ width: '150px', borderRadius: '8px' }}
                    />
                  }
                  checked={ods.includes('4')}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods5"
                  label={
                    <Image
                      src={ods5}
                      className="img-fluid"
                      style={{ width: '150px', borderRadius: '8px' }}
                    />
                  }
                  checked={ods.includes('5')}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods6"
                  label={
                    <Image
                      src={ods6}
                      className="img-fluid"
                      style={{ width: '150px', borderRadius: '8px' }}
                    />
                  }
                  checked={ods.includes('6')}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods7"
                  label={
                    <Image
                      src={ods7}
                      className="img-fluid"
                      style={{ width: '150px', borderRadius: '8px' }}
                    />
                  }
                  checked={ods.includes('7')}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods8"
                  label={
                    <Image
                      src={ods8}
                      className="img-fluid"
                      style={{ width: '150px', borderRadius: '8px' }}
                    />
                  }
                  checked={ods.includes('8')}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods9"
                  label={
                    <Image
                      src={ods9}
                      className="img-fluid"
                      style={{ width: '150px', borderRadius: '8px' }}
                    />
                  }
                  checked={ods.includes('9')}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods10"
                  label={
                    <Image
                      src={ods10}
                      className="img-fluid"
                      style={{ width: '150px', borderRadius: '8px' }}
                    />
                  }
                  checked={ods.includes('10')}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods11"
                  label={
                    <Image
                      src={ods11}
                      className="img-fluid"
                      style={{ width: '150px', borderRadius: '8px' }}
                    />
                  }
                  checked={ods.includes('11')}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods12"
                  label={
                    <Image
                      src={ods12}
                      className="img-fluid"
                      style={{ width: '150px', borderRadius: '8px' }}
                    />
                  }
                  checked={ods.includes('12')}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods13"
                  label={
                    <Image
                      src={ods13}
                      className="img-fluid"
                      style={{ width: '150px', borderRadius: '8px' }}
                    />
                  }
                  checked={ods.includes('13')}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods14"
                  label={
                    <Image
                      src={ods14}
                      className="img-fluid"
                      style={{ width: '150px', borderRadius: '8px' }}
                    />
                  }
                  checked={ods.includes('14')}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods15"
                  label={
                    <Image
                      src={ods15}
                      className="img-fluid"
                      style={{ width: '150px', borderRadius: '8px' }}
                    />
                  }
                  checked={ods.includes('15')}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods16"
                  label={
                    <Image
                      src={ods16}
                      className="img-fluid"
                      style={{ width: '150px', borderRadius: '8px' }}
                    />
                  }
                  checked={ods.includes('16')}
                  onChange={changeOds}
                ></Form.Check>
                <Form.Check
                  inline
                  type="checkbox"
                  id="ods17"
                  label={
                    <Image
                      src={ods17}
                      className="img-fluid"
                      style={{ width: '150px', borderRadius: '8px' }}
                    />
                  }
                  checked={ods.includes('17')}
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
