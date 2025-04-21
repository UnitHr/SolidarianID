import { Col, Container, Row, Image } from "react-bootstrap";
import { SolidarianNavbar } from "../components/SolidarianNavbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import communityLogo from "../assets/community-logo.png"; // Asegúrate de que esta ruta sea correcta

type CommunityDetails = {
  id: string;
  name: string;
  description: string;
  adminId: string;
};

export function CommunityDetails() {
  const { communityId } = useParams();
  const [community, setCommunity] = useState<CommunityDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!communityId) {
      setError("Comunidad no encontrada");
      return;
    }

    async function fetchCommunityDetails(communityId: string) {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/communities/${communityId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching community details");
        }

        const data = await response.json();
        setCommunity(data.data);
      } catch (error) {
        console.error("Error:", error);
        setError("Error fetching community details");
      } finally {
        setLoading(false);
      }
    }

    fetchCommunityDetails(communityId);
  }, [communityId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
                  <Col xs={12} md={9}>
                    <h2 className="mb-1">{community.name}</h2>
                  </Col>
                </Row>

                <hr className="my-4" />

                <Row>
                  <Col>
                    <p><strong>Community Description</strong></p>
                    <p>{community.description}</p>
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
