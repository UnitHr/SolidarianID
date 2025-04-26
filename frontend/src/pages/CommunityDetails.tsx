import { Col, Container, Row, Image, Button, Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import communityLogo from '../assets/community-logo.png';
import { Paginate } from '../components/Pagination';
import { CauseCard } from '../components/CauseCard';

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
};

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
      const response = await fetch(
        `http://localhost:3000/api/v1/communities/${communityId}/join-requests`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
        }
      );
      console.log('Response:', response);
      if (response.status === 409) {
        alert(
          'You have already sent a request to join this community or your request has been denied'
        );
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
      <Container className="py-4">
        {/* Header */}
        <Row className="align-items-center justify-content-between mb-4">
          <Col xs={12} md="auto" className="text-center text-md-start mb-3 mb-md-0">
            <Image
              src={communityLogo}
              alt="Community Logo"
              roundedCircle
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                border: '3px solid #0d6efd',
                boxShadow: '0 0 8px rgba(0,0,0,0.1)',
              }}
            />
          </Col>
          <Col xs={12} md className="text-center text-md-start">
            <h2 className="fw-bold mb-1">{community?.name}</h2>
            {isMember ? (
              <p className="text-success fw-semibold small mb-0">✅ You are already a member</p>
            ) : (
              <Button onClick={() => setShowModal(true)} variant="success" className="mt-2">
                Join Community
              </Button>
            )}
          </Col>
        </Row>

        <hr className="my-4" />

        {/* Description */}
        <Row className="mb-4">
          <Col>
            <h5 className="fw-semibold mb-2">Description</h5>
            <p className="text-muted">{community.description}</p>
          </Col>
        </Row>

        <hr className="my-4" />

        {/* Related Causes */}
        <Row className="align-items-center mb-3">
          <Col>
            <h5 className="fw-semibold mb-0">Related Causes</h5>
          </Col>
          <Col xs="auto">
            {isMember && (
              <Button
                onClick={() => navigate(`/communities/${communityId}/causes/new`)}
                variant="primary"
              >
                + Create Cause
              </Button>
            )}
          </Col>
        </Row>

        {/* Causes */}
        <Row className="g-3">
          {causes.map((cause) => (
            <Col key={cause.id} xs={12} md={6} lg={4}>
              <CauseCard id={cause.id} title={cause.title} description={cause.description} />
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        {causes.length > 0 && (
          <Row className="mt-4">
            <Col className="d-flex justify-content-center">
              <Paginate
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </Col>
          </Row>
        )}
      </Container>

      {/* Join Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Join Community</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to join <strong>{community?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={handleJoin}>
            Yes, Join
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
