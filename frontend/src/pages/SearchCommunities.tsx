import { Col, Container, Row } from "react-bootstrap";
import { SolidarianNavbar } from "../components/SolidarianNavbar";
import { FormFilterCommunities } from "../components/FormFilterCommunities";

export function SearchCommunities() {
  return (
    <>
      <SolidarianNavbar></SolidarianNavbar>
      <Container>
        <Row>
          <Row className="my-4">
            <h1>Filter Communities</h1>
          </Row>
          <Row className="my-4">
            <h3 className="px-4 py-4 text-justify">
              Discover and contribute to various communities and charitable
              causes Whether you're looking to support or to take action, get
              involved today!
            </h3>
          </Row>
        </Row>
        <Row>
          <Col></Col>
          <Col>
            <FormFilterCommunities></FormFilterCommunities>
          </Col>
          <Col></Col>
        </Row>
        <Row></Row>
      </Container>
    </>
  );
}
