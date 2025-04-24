import { Col, Container, Row, Image, OverlayTrigger, Tooltip, Button, Modal } from 'react-bootstrap';
import { SolidarianNavbar } from '../components/SolidarianNavbar';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import communityLogo from '../assets/community-logo.png';
import '../styles/links.css';
import { Paginate } from '../components/Pagination';

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

type User = {
  userId: string;
  token: string;
}

export function CommunityDetails() {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<CommunityDetails | null>(null);
  const [causes, setCauses] = useState<CauseDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const limit = 6;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {

    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    console.log('Parsed User:', parsedUser);
    setUser(parsedUser);

    if (!communityId) {
      return;
    }

    async function fetchCommunityDetails(communityId: string) {
      try {
        const community = await fetch(`http://localhost:3000/api/v1/communities/${communityId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!community.ok) {
          throw new Error('Error fetching community details');
        }

        const data = await community.json();
        setCommunity(data.data);

        //Get causes of the community
        const causes = await fetch(
          `http://localhost:3000/api/v1/communities/${communityId}/causes?page=${page}&limit=${limit}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!causes.ok) {
          throw new Error('Error fetching causes of community');
        }

        const causesData = await causes.json();

        setTotalPages(causesData.meta.totalPages);

        // Obtener detalles solo para los causes de esta página
        const detailRequests = causesData.data.map((id: string) =>
          fetch(`http://localhost:3000/api/v1/causes/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }).then((res) => res.json())
        );

        const entityDetails = await Promise.all(detailRequests);
        setCauses(entityDetails);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    async function fetchMembersRecursively(communityId: string, userId: string) {
      let page = 1;
      const pageLimit = 10;
      let allMemberIds: string[] = [];
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await fetch(
          `http://localhost:3000/api/v1/communities/${communityId}/members?page=${page}&limit=${pageLimit}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) throw new Error('Error fetching members');
        const result = await response.json();
        allMemberIds = [...allMemberIds, ...result.data];
        hasNextPage = result.meta.hasNextPage;
        page++;
      }

      console.log('All Member IDs:', allMemberIds);
      console.log('User ID:', userId);
      if (allMemberIds.includes(userId)) {
        setIsMember(true);
      }
    }

    async function loadAllData() {
      try {
        await Promise.all([
          fetchCommunityDetails(communityId!),
          fetchMembersRecursively(communityId!, parsedUser.userId),
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, [communityId, page]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleJoin = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/communities/${communityId}/join-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' ,
          Authorization: `Bearer ${user?.token}`
        },
      });
      console.log('Response:', response);
      if (response.status === 409) {
        alert('You have already sent a request to join this community or your request has been denied');
        setShowModal(false);
        return;
      }
      if (!response.ok) throw new Error('Failed to join community');
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

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
                        width: '120px',
                        height: '120px',
                        objectFit: 'cover',
                        border: '3px solid #007bff',
                        padding: '5px',
                      }}
                    />
                  </Col>
                  <Col xs={12} md={6}>
                    <h2 className="mb-1">{community.name}</h2>
                  </Col>
                  <Col xs={12} md={3} className="d-flex align-items-start justify-content-center mt-3 mt-md-5">
                    {!isMember ? (
                      <Button
                        onClick={() => setShowModal(true)}
                        className="btn btn-primary w-100"
                      >
                        Join Community
                      </Button>
                    ) : (
                      <p className="text-success fw-bold text-center">
                        You are a member of this community
                      </p>
                    )}
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
                        <Paginate
                          currentPage={page}
                          totalPages={totalPages}
                          onPageChange={(newPage) => setPage(newPage)}
                        />
                      </>
                    )}
                  </Col>
                </Row>
              </div>
            ) : (
              <p>No data found.</p>
            )}
          </Col>
        </Row>
      </Container>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Join Community</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to join <strong>{community?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleJoin}>
            Yes, Join
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
