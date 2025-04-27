import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import { followUser, getStoredUser } from '../services/user.service';
import { Paginate } from '../components/Pagination';
import { useUserHistory } from '../lib/hooks/useUserHistory';
import { UserCircle } from 'lucide-react';

export function UserHistory() {
  const {
    effectiveUserId,
    userFullName,
    userBio,
    userEmail,
    userAge,
    following,
    followers,
    communities,
    causes,
    supports,
    requests,
    totalPages,
    totalCount,
    page,
    loading,
    setPage,
  } = useUserHistory();

  const navigate = useNavigate();
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [view, setView] = useState<'communities' | 'causes' | 'supports' | 'requests' | null>(null);

  const [isFollowing, setIsFollowing] = useState(false);
  const storedUser = getStoredUser();

  const isOwnProfile = storedUser?.userId === effectiveUserId;

  useEffect(() => {
    if (following.some((f) => f.followedUserId === storedUser?.userId)) {
      setIsFollowing(true);
    }
  }, [following, storedUser]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div>Loading...</div>
      </Container>
    );
  }

  const handleNavigateProfile = (id: string) => {
    setShowFollowersModal(false);
    setShowFollowingModal(false);
    navigate(`/profile/${id}`);
  };

  const handleFollow = async () => {
    if (!effectiveUserId || isFollowing) return;

    try {
      // Call service
      await followUser(effectiveUserId);
      setIsFollowing(true);
      alert('Now following this user!');
    } catch (error) {
      console.error('Error following user:', error);
      alert('Failed to follow. Please try again.');
    }
  };

  return (
    <Container className="py-5">
      {/* Profile Header */}
      <Row className="justify-content-center text-center mb-4">
        <Col md={8}>
          <UserCircle size={100} strokeWidth={1} className="text-muted mb-3" />
          <h3 className="fw-bold">{userFullName}</h3>
          {userBio && <p className="text-muted">{userBio}</p>}
          {effectiveUserId && (
            <p className="text-muted small mb-1">
              👤 <strong>SolidarianID:</strong> {effectiveUserId}
            </p>
          )}
          {userEmail && (
            <p className="text-muted small mb-1">
              📧 <strong>Email:</strong> {userEmail}
            </p>
          )}
          {userAge && (
            <p className="text-muted small">
              🎂 <strong>Age:</strong> {userAge}
            </p>
          )}

          {/* Follow Button */}
          {!isOwnProfile && (
            <Button
              variant={isFollowing ? 'secondary' : 'primary'}
              size="sm"
              className="mt-3"
              onClick={handleFollow}
              disabled={isFollowing}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          )}
        </Col>
      </Row>

      {/* Follow Counters */}
      <Row className="g-3 justify-content-center mb-5">
        <Col xs="auto">
          <Card
            onClick={() => setShowFollowingModal(true)}
            className="shadow-sm"
            style={{ cursor: 'pointer', minWidth: '140px' }}
          >
            <Card.Body className="text-center py-3">
              <h5 className="fw-bold">{totalCount.following}</h5>
              <p className="text-muted mb-0">Following</p>
            </Card.Body>
          </Card>
        </Col>
        <Col xs="auto">
          <Card
            onClick={() => setShowFollowersModal(true)}
            className="shadow-sm"
            style={{ cursor: 'pointer', minWidth: '140px' }}
          >
            <Card.Body className="text-center py-3">
              <h5 className="fw-bold">{totalCount.followers}</h5>
              <p className="text-muted mb-0">Followers</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Navigation Cards */}
      <Row className="g-3 mb-5">
        {[
          { key: 'communities', label: 'Communities', count: totalCount.communities },
          { key: 'causes', label: 'Causes', count: totalCount.causes },
          { key: 'supports', label: 'Supports', count: totalCount.supports },
          { key: 'requests', label: 'Requests', count: totalCount.requests },
        ].map((item) => (
          <Col xs={12} sm={6} md={3} key={item.key}>
            <Card
              onClick={() =>
                setView(item.key as 'communities' | 'causes' | 'supports' | 'requests')
              }
              className="shadow-sm text-center"
              style={{ cursor: 'pointer' }}
            >
              <Card.Body>
                <Card.Title className="fw-bold">{item.label}</Card.Title>
                <Card.Text>{item.count}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Dynamic List */}
      {view && (
        <Card className="shadow-sm mb-4">
          <Card.Header className="fw-bold">
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </Card.Header>
          <Card.Body>
            <ul className="list-unstyled mb-0">
              {(view === 'communities'
                ? communities
                : view === 'causes'
                  ? causes
                  : view === 'supports'
                    ? supports
                    : requests
              ).map((item) => (
                <li key={item.entityId} className="mb-2">
                  <Link
                    to={`/${view === 'supports' ? 'actions' : view === 'requests' ? 'communities' : view}/${item.entityId}`}
                    className="entity-link"
                  >
                    {item.entityName}
                  </Link>
                </li>
              ))}
            </ul>
            <Paginate
              currentPage={page[`${view}Page`]}
              totalPages={totalPages[view]}
              onPageChange={(newPage) => setPage((prev) => ({ ...prev, [`${view}Page`]: newPage }))}
            />
          </Card.Body>
        </Card>
      )}

      {/* Following Modal */}
      <Modal show={showFollowingModal} onHide={() => setShowFollowingModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Following</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {following.length ? (
            <ul className="list-unstyled mb-0">
              {following.map((f) => (
                <li
                  key={f.followedUserId}
                  onClick={() => handleNavigateProfile(f.followedUserId)}
                  style={{ cursor: 'pointer', padding: '0.5rem 0' }}
                >
                  {f.fullName}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">You are not following anyone yet.</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Followers Modal */}
      <Modal show={showFollowersModal} onHide={() => setShowFollowersModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Followers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {followers.length ? (
            <ul className="list-unstyled mb-0">
              {followers.map((f) => (
                <li
                  key={f.followerId}
                  onClick={() => handleNavigateProfile(f.followerId)}
                  style={{ cursor: 'pointer', padding: '0.5rem 0' }}
                >
                  {f.fullName}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">You have no followers yet.</p>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
