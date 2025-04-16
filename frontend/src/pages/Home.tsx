import { Col, Container, Row, Image, Button } from "react-bootstrap";
import girlImage from "../assets/chica-solidarianid.png";
import logo from "../assets/logo-solidarianid.png";
import { SolidarianNavbar } from "../components/SolidarianNavbar";

export function Home() {
  return (
    <>
      <SolidarianNavbar></SolidarianNavbar>
      <Container>
        <Row className="my-4">
          <Col>
            <Row className="my-4">
              <Image src={logo} fluid />
            </Row>
            <Row className="my-4">
              <Row>
                <h1>Support</h1>
              </Row>
              <Row>
                <h1>Communities, Causes</h1>
              </Row>
              <Row>
                <h1>and Actions</h1>
              </Row>
            </Row>
            <Row clasName="">
              <h3 className="px-4 py-4 text-justify">
                Discover and contribute to various communities and charitable
                causes Whether you're looking to support or to take action, get
                involved today!
              </h3>
            </Row>
          </Col>
          <Col>
            <Container>
              <Image src={girlImage} fluid />
            </Container>
          </Col>
        </Row>
        <Row>
          <Row className="py-4 px-4">
            <h2 className="text-center font-weight-bold">
              Explore our platform to find communities, causes and actions to
              support.
            </h2>
          </Row>
          <Row>
            <Col className="mx-4 my-4">
              <Row>
                <Button variant="primary">Find Communities</Button>
              </Row>
            </Col>
            <Col className="mx-4 my-4">
              <Row>
                <Button variant="primary">Find Causes</Button>
              </Row>
            </Col>
            <Col className="mx-4 my-4">
              <Row>
                <Button variant="primary">Find Actions</Button>
              </Row>
            </Col>
          </Row>
        </Row>
      </Container>
    </>
  );
}
