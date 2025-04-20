import { Col, Container, Row, Image } from "react-bootstrap";
import { SolidarianNavbar } from "../components/SolidarianNavbar";
import { FormFilterCommunities } from "../components/FormFilterCommunities";
import { CommunityCard } from "../components/CommunityCard";
import image from "../assets/filter-community-image.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SearchCommunities() {
  const [name, setName] = useState("asvc");
  const navigate = useNavigate();

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
            <h1 className="text-center">Filter Communities {name}</h1>
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
          <Col className="d-flex justify-content-center align-items-center">
            <FormFilterCommunities
              name={name}
              changeName={changeName}
            ></FormFilterCommunities>
          </Col>
          <Col>
            <Image src={image} fluid />
          </Col>
        </Row>
        <Row className="my-4">
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
        </Row>
      </Container>
    </>
  );
}
