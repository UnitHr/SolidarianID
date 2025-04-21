import { Col, Container, Row, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { SolidarianNavbar } from "../components/SolidarianNavbar";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import odsImages from "../utils/odsImages"
import "../styles/links.css";

type CommunityDetails = {
  id: string;
  name: string;
};

type OdsItem = {
  id: number;
  title: string;
  description: string;
};

type CauseDetails = {
  id: string;
  title: string;
  description: string;
  communityId: string;
  createdAt: string;
  createdBy: string;
  endDate: string;
  ods: OdsItem[];
};

type ActionDetails = {
  id: string;
  title: string;
  description: string;
  causeId: string;
  status: string;
};

export function CauseDetails() {
  const { causeId } = useParams();
  const [cause, setCause] = useState<CauseDetails | null>(null);
  const [community, setCommunity] = useState<CommunityDetails | null>(null);
  const [actions, setActions] = useState<ActionDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();

    return `${formattedDate} at ${formattedTime}`;
  };

  useEffect(() => {
    if (!causeId) {
      return;
    }

    async function fetchCauseDetails(causeId: string) {
      try {
        const cause = await fetch(`http://localhost:3000/api/v1/causes/${causeId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!cause.ok) {
          throw new Error("Error fetching community details");
        }

        const data = await cause.json();
        setCause(data);

        //Get creator of the cause
        const creator = await fetch(`http://localhost:3000/api/v1/users/${data.createdBy}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!creator.ok) {
          throw new Error("Error fetching creator details");
        }
        const creatorData = await creator.json();
        setFullName(`${creatorData.firstName} ${creatorData.lastName}`);

        //Get community of the cause
        const community = await fetch(`http://localhost:3000/api/v1/communities/${data.communityId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!community.ok) {
          throw new Error("Error fetching community details");
        }
        const communityData = await community.json();
        setCommunity(communityData.data);

        //Get actions of the cause
        const actions = await fetch(`http://localhost:3000/api/v1/causes/${causeId}/actions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!actions.ok) {
          throw new Error("Error fetching actions of cause");
        }

        const actionsData = await actions.json();
        const detailRequests = actionsData.data.map((id: string) =>
          fetch(`http://localhost:3000/api/v1/actions/${id}`).then(res => res.json())
        );

        const entityDetails = await Promise.all(detailRequests);
        setActions(entityDetails);

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCauseDetails(causeId);
  }, [causeId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SolidarianNavbar />
      <Container className="mt-4">
        <Row>
          <Col md={12}>
            {cause ? (
              <div>
                {cause.ods && cause.ods.length > 0 && (
                  <Row className="justify-content-center mb-5">
                    {cause.ods.map((odsItem) => (
                      <Col
                        key={odsItem.id}
                        xs={6}
                        sm={4}
                        md={3}
                        lg={2}
                        className="d-flex flex-column align-items-center"
                      >
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-ods-${odsItem.id}`}>
                              {odsItem.title}: {odsItem.description}
                            </Tooltip>
                          }
                        >
                          <Image
                            src={odsImages[odsItem.id]}
                            alt={odsItem.title}
                            className="img-fluid"
                            style={{
                              width: "100px",
                              borderRadius: "8px",
                              border: "2px solid #ddd",
                            }}
                          />
                        </OverlayTrigger>
                      </Col>
                    ))}
                  </Row>
                )}
                <Row className="justify-content-center mb-3">
                  <Col xs={12} md={9}>
                    <h2 className="mb-1 text-center">{cause.title}</h2>
                    <p className="text-center text-muted mt-3">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-ods-${community?.id}`}>
                            Community
                          </Tooltip>
                        }
                      >
                        <Link to={`/communities/${community?.id}`} className="fw-bold text-decoration-none entity-link">
                          {community?.name}
                        </Link>
                      </OverlayTrigger>
                    </p>
                  </Col>
                </Row>
                <hr className="my-4" />

                <Row>
                  <Col>
                    <p><strong>Created by:</strong> {fullName}</p>
                    <p><strong>Created on:</strong> {formatDate(cause.createdAt)}</p>
                    <p><strong>End date:</strong> {formatDate(cause.endDate)}</p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h4 className="mt-3 mb-3 ">Cause Description</h4>
                    <p>{cause.description}</p>
                    {actions.length > 0 && (
                      <>
                        <h4 className="mb-3">Related Actions</h4>
                        {actions.map((action) => (
                          <div key={action.id} className="mb-4">
                            <h5>
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id={`tooltip-${action.id}`}>Show details</Tooltip>}
                              >
                                <Link to={`/actions/${action.id}`} className="entity-link">
                                  {action.title}
                                </Link>
                              </OverlayTrigger>
                            </h5>
                            <p>{action.description}</p>
                            <p>Status: {action.status}</p>
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
