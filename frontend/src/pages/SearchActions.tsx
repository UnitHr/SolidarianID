import { Col, Container, Row, Image } from "react-bootstrap";
import { SolidarianNavbar } from "../components/SolidarianNavbar";
import image from "../assets/filter-actions-image.png";
import { FormFilterActions } from "../components/FormFilterActions";

export function SearchActions() {
  return (
    <>
      <SolidarianNavbar></SolidarianNavbar>
      <Container>
        <Row className="my-5">
          <h1 className="text-center">Search Actions</h1>
        </Row>
        <Row className="my-4">
          <h3 className="px-4 py-4 text-justify">
            Find meaningful actions you can contribute to. Use the search tool
            to explore initiatives aligned with your interests and help
            communities reach their goals.
          </h3>

          <h4 className="px-4 py-4 text-justify">
            Whether it's volunteering, donating, or spreading awareness — every
            action counts toward creating positive change.
          </h4>
        </Row>
        <Row>
          <Col sm={6} md={6} lg={6}>
            <Image src={image} fluid />
          </Col>
          <Col>
            <FormFilterActions></FormFilterActions>
          </Col>
        </Row>
      </Container>
    </>
  );
}
