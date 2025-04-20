import {
  Col,
  Container,
  Row,
  Image,
  ListGroup,
  Pagination,
} from "react-bootstrap";
import { SolidarianNavbar } from "../components/SolidarianNavbar";
import { FormFilterCommunities } from "../components/FormFilterCommunities";
import { CommunityCard } from "../components/CommunityCard";
import image from "../assets/filter-communities-image-2.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SearchCommunities() {
  const [name, setName] = useState("asvc");
  const navigate = useNavigate();
  const [search, setSearch] = useState(false);

  function changeName(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function handleCreateCommunity() {
    navigate("/create-community");
  }

  return (
    <>
      <SolidarianNavbar></SolidarianNavbar>
      <Container>
        <Row>
          <Row className="my-5">
            <h1 className="text-center">Search Communities</h1>
          </Row>
          <Row className="my-3 text-center">
            <p>
              or create a new one{" "}
              <button
                className="btn btn-primary"
                onClick={handleCreateCommunity}
              >
                Create Community
              </button>
            </p>
          </Row>
          <Row className="my-3 text-center">
            <p>
              or create a new one{" "}
              <button
                className="btn btn-primary"
                onClick={handleCreateCommunity}
              >
                Create Community
              </button>
            </p>
          </Row>
          <Row className="my-4">
            <h3 className="px-4 py-4 text-justify">
              Discover and contribute to various communities and charitable
              causes Whether you're looking to support or to take action, get
              involved today!
            </h3>
          </Row>
        </Row>
        <Row className="align-items-center">
          <Col>
            <Image src={image} fluid />
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <FormFilterCommunities
              name={name}
              changeName={changeName}
            ></FormFilterCommunities>
          </Col>
        </Row>
        <Row className="my-4">
          <Container>
            <Row>
              {search && (
                <>
                  <h3>Results: </h3>
                </>
              )}
            </Row>
            {search && (
              <>
                <Row>
                  <ListGroup className="my-2">
                    <ListGroup.Item variant="secondary">
                      <Row className="mt-3 mb-2">
                        <Col>
                          <CommunityCard
                            name="Community 1"
                            description="This is a description for community 1"
                          ></CommunityCard>
                        </Col>
                        <Col>
                          <CommunityCard
                            name="Community 1"
                            description="This is a description for community 1"
                          ></CommunityCard>
                        </Col>
                        <Col>
                          <CommunityCard
                            name="Community 1"
                            description="This is a description for community 1"
                          ></CommunityCard>
                        </Col>
                        <Col>
                          <CommunityCard
                            name="Community 1"
                            description="This is a description for community 1"
                          ></CommunityCard>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                  <ListGroup className="my-2">
                    <ListGroup.Item variant="secondary">
                      <Row className="mt-3 mb-2">
                        <Col>
                          <CommunityCard
                            name="Community 1"
                            description="This is a description for community 1"
                          ></CommunityCard>
                        </Col>
                        <Col>
                          <CommunityCard
                            name="Community 1"
                            description="This is a description for community 1"
                          ></CommunityCard>
                        </Col>
                        <Col>
                          <CommunityCard
                            name="Community 1"
                            description="This is a description for community 1"
                          ></CommunityCard>
                        </Col>
                        <Col>
                          <CommunityCard
                            name="Community 1"
                            description="This is a description for community 1"
                          ></CommunityCard>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                </Row>
                <Pagination>
                  <Pagination.First />
                  <Pagination.Prev />
                  <Pagination.Item>{1}</Pagination.Item>
                  <Pagination.Next />
                  <Pagination.Last />
                </Pagination>
              </>
            )}
          </Container>
        </Row>
      </Container>
    </>
  );
}
