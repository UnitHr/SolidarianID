import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Image, Button, Modal } from 'react-bootstrap';
import {
  getCommunityCauses,
  getTotalCausesPages,
  getCommunityMembers,
  sendJoinRequest,
} from '../services/community.service';
import { useCommunityById } from '../lib/hooks/useCommunity';
import { getStoredUser } from '../services/user.service';
import { CauseDetails } from '../lib/types/cause.types';
import { User } from '../lib/types/user.types';
import { Paginate } from '../components/Pagination';
import { CauseCard } from '../components/CauseCard';
import communityLogo from '../assets/community-logo.png';

export function CommunityDetails() {
  const navigate = useNavigate();
  const { communityId } = useParams();

  // Use the community hook to fetch community data
  const { loading: communityLoading, community } = useCommunityById(communityId || '');

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [causes, setCauses] = useState<CauseDetails[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadCauseAndMembershipData = async (communityId: string) => {
      try {
        setLoading(true);

        const [causesData, totalCausesPages] = await Promise.all([
          getCommunityCauses(communityId, page),
          getTotalCausesPages(communityId),
        ]);

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

    if (communityId) {
      loadCauseAndMembershipData(communityId);
    }
  }, [communityId, page, community]);

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

  const isLoadingAll = loading || communityLoading;

  if (isLoadingAll) {
    return (
      <Container className="py-5 text-center">
        <div>Loading...</div>
      </Container>
    );
  }

  if (!community) {
    return (
      <Container className="py-5 text-center">
        <h4>Community not found</h4>
      </Container>
    );
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
          <Col xs={12} md>
            <div className="text-center text-md-start">
              <h2 className="fw-bold mb-1">{community?.name}</h2>
              <p className="text-muted mb-1">{community?.description}</p>
              {community.admin && (
                <p className="text-muted small mb-0">
                  <strong>Admin:</strong>{' '}
                  <Link
                    to={`/profile/${community.admin.id}`}
                    className="text-decoration-none entity-link"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/profile/${community.admin?.id}`);
                    }}
                  >
                    {community.admin.firstName} {community.admin.lastName}
                  </Link>
                </p>
              )}
            </div>
          </Col>
          <Col xs={12} md="auto" className="text-center text-md-end mt-3 mt-md-0">
            {user &&
              (isMember ? (
                <p className="text-success fw-semibold small mb-0">✅ You are already a member</p>
              ) : (
                <Button onClick={() => setShowModal(true)} variant="primary" className="mt-2">
                  Join Community
                </Button>
              ))}
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
