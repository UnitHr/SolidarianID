import { Col, Row, Image, Container } from "react-bootstrap";
import { SolidarianNavbar } from "../components/SolidarianNavbar";
import { FormFilterCauses } from "../components/FormFilterCauses";
import image from "../assets/filter-causes-image.png";

export function SearchCauses() {
  return (
    <>
      <SolidarianNavbar></SolidarianNavbar>
      <Container>
        <Row className="my-5">
          <h1 className="text-center">Filter Causes</h1>
        </Row>
        <Row className="my-4">
          <h3 className="px-4 py-4 text-justify">
            Discover and contribute to various communities and charitable causes
            Whether you're looking to support or to take action, get involved
            today!
          </h3>
        </Row>
        <Row>
          <Col>
            <Row className="mt-5">
              <FormFilterCauses></FormFilterCauses>
            </Row>
          </Col>
          <Col>
            <Image src={image} fluid />
          </Col>
        </Row>
      </Container>
    </>
  );
}
