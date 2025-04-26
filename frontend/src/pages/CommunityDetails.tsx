import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Image, Button, Modal } from 'react-bootstrap';
import {
  getCommunityById,
  getCommunityCauses,
  getTotalCausesPages,
  getCommunityMembers,
  sendJoinRequest,
} from '../services/community.service';
import { getStoredUser } from '../services/user.service';
import { CommunityDetails as CommunityType } from '../lib/types/community.types';
import { CauseDetails } from '../lib/types/cause.types';
import { User } from '../lib/types/user.types';
import { Paginate } from '../components/Pagination';
import { CauseCard } from '../components/CauseCard';
import communityLogo from '../assets/community-logo.png';

export function CommunityDetails() {
  const navigate = useNavigate();
  const { communityId } = useParams();

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [community, setCommunity] = useState<CommunityType | null>(null);
  const [causes, setCauses] = useState<CauseDetails[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (communityId) {
      loadCommunityData(communityId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId, page]);

  const loadCommunityData = async (communityId: string) => {
    try {
      setLoading(true);

      const [communityData, causesData, totalCausesPages] = await Promise.all([
        getCommunityById(communityId),
        getCommunityCauses(communityId, page),
        getTotalCausesPages(communityId),
      ]);

      setCommunity(communityData);
      setCauses(causesData);
      setTotalPages(totalCausesPages);

      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);

        // Check membership only if logged in
        const memberIds = await getCommunityMembers(communityId);
        setIsMember(memberIds.includes(storedUser.userId));
      }
    } catch (error) {
      console.error('Error loading community details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!communityId || !user) return;

    try {
      const response = await sendJoinRequest(communityId);

      if (response.status === 409) {
        alert(
          'You have already sent a request to join this community or your request has been denied.'
        );
      } else if (!response.ok) {
        throw new Error('Failed to join community');
      } else {
        alert('Join request sent successfully!');
      }
    } catch (error) {
      console.error('Join error:', error);
    } finally {
      setShowModal(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
            {user &&
              (isMember ? (
                <p className="text-success fw-semibold small mb-0">✅ You are already a member</p>
              ) : (
                <Button onClick={() => setShowModal(true)} variant="success" className="mt-2">
                  Join Community
                </Button>
              ))}
          </Col>
        </Row>

        <hr className="my-4" />

        {/* Description */}
        <Row className="mb-4">
          <Col>
            <h5 className="fw-semibold mb-2">Description</h5>
            <p className="text-muted">{community?.description}</p>
          </Col>
        </Row>

        <hr className="my-4" />

        {/* Related Causes */}
        <Row className="align-items-center mb-3">
          <Col>
            <h5 className="fw-semibold mb-0">Related Causes</h5>
          </Col>
          <Col xs="auto">
            {user && isMember && (
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
