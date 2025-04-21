import { Col, Container, Row, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { SolidarianNavbar } from "../components/SolidarianNavbar";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import communityLogo from "../assets/community-logo.png";
import "../styles/links.css";

type CommunityDetails = {
  id: string;
  name: string;
  description: string;
  adminId: string;
};

type CauseDetails = {
  id: string;
  title: string;
  description: string;
};

export function CommunityDetails() {
  const { communityId } = useParams();
  const [community, setCommunity] = useState<CommunityDetails | null>(null);
  const [causes, setCauses] = useState<CauseDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!communityId) {
      return;
    }

    async function fetchCommunityDetails(communityId: string) {
      try {
        const community = await fetch(`http://localhost:3000/api/v1/communities/${communityId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!community.ok) {
          throw new Error("Error fetching community details");
        }

        const data = await community.json();
        setCommunity(data.data);

        //Get causes of the community
        const causes = await fetch(`http://localhost:3000/api/v1/communities/${communityId}/causes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!causes.ok) {
          throw new Error("Error fetching causes of community");
        }

        const causesData = await causes.json();

        const detailRequests = causesData.data.map((id: string) =>
          fetch(`http://localhost:3000/api/v1/causes/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          ).then(res => res.json())
        );

        const entityDetails = await Promise.all(detailRequests);
        setCauses(entityDetails);

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCommunityDetails(communityId);
  }, [communityId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SolidarianNavbar />
      <Container className="mt-4">
        <Row>
          <Col md={12}>
            {community ? (
              <div>
                <Row className="align-items-center mb-3">
                  <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
                    <Image
                      src={communityLogo}
                      alt="Community Logo"
                      fluid
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        border: "3px solid #007bff",
                        padding: "5px",
                      }}
                    />
                  </Col>
                  <Col xs={12} md={6}>
                    <h2 className="mb-1">{community.name}</h2>
                  </Col>
                  <Col xs={12} md={3} className="d-flex align-items-start">
                    <Link to={`/join/${community.id}`} className="btn btn-primary mt-5 w-100">
                      Join Community
                    </Link>
                  </Col>
                </Row>
                <hr className="my-4" />

                <Row>
                  <Col>
                    <h4 className="mb-3">Community Description</h4>
                    <p>{community.description}</p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {causes.length > 0 && (
                      <>
                        <h4 className="mb-3">Related Causes</h4>
                        {causes.map((cause) => (
                          <div key={cause.id} className="mb-4">
                            <h5>
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id={`tooltip-${cause.id}`}>Show details</Tooltip>}
                              >
                                <Link to={`/causes/${cause.id}`} className="entity-link">
                                  {cause.title}
                                </Link>
                              </OverlayTrigger>
                            </h5>
                            <p>{cause.description}</p>
                          </div>
                        ))}
                      </>
                    )}
                  </Col>
                </Row>
              </div>
            ) : (
              <p>No se encontraron detalles para esta comunidad.</p>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
