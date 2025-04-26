import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Image, Modal, Button } from 'react-bootstrap';
import { Paginate } from '../components/Pagination';

import girlImage from '../assets/chica-solidarianid.png';
import altImage from '../assets/chico.png';
import '../styles/profile.css';

type HistoryEntry = {
  type: string;
  entityId: string;
  entityName: string;
  timestamp: string;
};

type Following = {
  followedUserId: string;
  fullName: string;
};

type User = {
  userId: string;
  firstName: string;
  lastName: string;
  roles: string[];
  token: string;
  exp: number;
};

export function UserHistory() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [following, setFollowing] = useState<Following[]>([]);
  const [communities, setCommunities] = useState<HistoryEntry[]>([]);
  const [causes, setCauses] = useState<HistoryEntry[]>([]);
  const [supports, setSupports] = useState<HistoryEntry[]>([]);
  const [request, setRequest] = useState<HistoryEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [profileImage, setProfileImage] = useState(girlImage);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCommunities, setShowCommunities] = useState(false);
  const [showCauses, setShowCauses] = useState(false);
  const [showSupports, setShowSupports] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [fullName, setFullName] = useState('');
  const limit = 6;
  const [page, setPage] = useState({
    followingPage: 1,
    communitiesPage: 1,
    causesPage: 1,
    supportsPage: 1,
    requestPage: 1,
  });
  const [totalPages, setTotalPages] = useState({
    followingTotalPage: 0,
    communitiesTotalPage: 0,
    causesTotalPage: 0,
    supportsTotalPage: 0,
    requestTotalPage: 0,
  });
  const [totalCount, setTotalCount] = useState({
    followingTotalCount: 0,
    communitiesTotalCount: 0,
    causesTotalCount: 0,
    supportsTotalCount: 0,
    requestTotalCount: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      navigate('/');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const exp = parsedUser.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    if (exp && exp < currentTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }

    const storedImageType = localStorage.getItem('profileImageType');
    if (storedImageType === 'boy') {
      setProfileImage(altImage);
    } else {
      setProfileImage(girlImage);
    }

    if (userId) {
      parsedUser.userId = userId;
    }

    async function fetchUser() {
      try {
        const response = await fetch(`http://localhost:3000/api/v1/users/${parsedUser.userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFullName(data.firstName + ' ' + data.lastName);
        } else {
          console.error('Error fetching user data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    async function fetchHistory() {
      try {
        // Get following history
        const followingResponse = await fetch(
          `http://localhost:3000/api/v1/users/${parsedUser.userId}/following?page=${page.followingPage}&limit=${limit}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${parsedUser.token}`,
            },
          }
        );

        if (followingResponse.ok) {
          const followingsData = await followingResponse.json();
          setFollowing(followingsData.data);
          setTotalPages((prev) => ({
            ...prev,
            followingTotalPage: followingsData.meta.totalPages,
          }));
          setTotalCount((prev) => ({
            ...prev,
            followingTotalCount: followingsData.meta.total,
          }));
        } else {
          console.error('Error fetching followings history');
        }

        // Get communities history
        const communitiesResponse = await fetch(
          `http://localhost:3000/api/v1/users/${parsedUser.userId}/history?type=JOINED_COMMUNITY&page=${page.communitiesPage}&limit=${limit}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${parsedUser.token}`,
            },
          }
        );
        if (communitiesResponse.ok) {
          const communitiesData = await communitiesResponse.json();
          setCommunities(communitiesData.data);
          setTotalPages((prev) => ({
            ...prev,
            communitiesTotalPage: communitiesData.meta.totalPages,
          }));
          setTotalCount((prev) => ({
            ...prev,
            communitiesTotalCount: communitiesData.meta.total,
          }));
        } else {
          console.error('Error fetching communities history');
        }

        // Get causes history
        const causesResponse = await fetch(
          `http://localhost:3000/api/v1/users/${parsedUser.userId}/history?type=CAUSE_SUPPORT&page=${page.causesPage}&limit=${limit}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${parsedUser.token}`,
            },
          }
        );
        if (causesResponse.ok) {
          const causesData = await causesResponse.json();
          setCauses(causesData.data);
          setTotalPages((prev) => ({
            ...prev,
            causesTotalPage: causesData.meta.totalPages,
          }));
          setTotalCount((prev) => ({
            ...prev,
            causesTotalCount: causesData.meta.total,
          }));
        } else {
          console.error('Error fetching causes history');
        }

        // Get supports history
        const supportsResponse = await fetch(
          `http://localhost:3000/api/v1/users/${parsedUser.userId}/history?type=ACTION_CONTRIBUTED&page=${page.supportsPage}&limit=${limit}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${parsedUser.token}`,
            },
          }
        );
        if (supportsResponse.ok) {
          const supportsData = await supportsResponse.json();
          setSupports(supportsData.data);
          setTotalPages((prev) => ({
            ...prev,
            supportsTotalPage: supportsData.meta.totalPages,
          }));
          setTotalCount((prev) => ({
            ...prev,
            supportsTotalCount: supportsData.meta.total,
          }));
        } else {
          console.error('Error fetching supports history');
        }

        // Get request history
        const requestResponse = await fetch(
          `http://localhost:3000/api/v1/users/${parsedUser.userId}/history?type=JOIN_COMMUNITY_REQUEST_SENT&status=PENDING&page=${page.requestPage}&limit=${limit}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${parsedUser.token}`,
            },
          }
        );
        if (requestResponse.ok) {
          const requestData = await requestResponse.json();
          setRequest(requestData.data);
          setTotalPages((prev) => ({
            ...prev,
            requestTotalPage: requestData.meta.totalPages,
          }));
          setTotalCount((prev) => ({
            ...prev,
            requestTotalCount: requestData.meta.total,
          }));
        } else {
          console.error('Error fetching request history');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
    fetchHistory();
  }, [navigate, page]);

  if (loading || !user) {
    return <p>Loading...</p>;
  }

  const handleFollowingClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleImageClick = () => setShowImageModal(true);

  const handleImageSelect = (image: string) => {
    setProfileImage(image);
    const imageType = image === girlImage ? 'girl' : 'boy';
    localStorage.setItem('profileImageType', imageType);
    setShowImageModal(false);
  };

  return (
    <>
      <Container className="mt-4">
        <Row className="align-items-center mb-4">
          <Col xs={2}>
            <Image
              src={profileImage}
              fluid
              style={{ cursor: 'pointer', borderRadius: '50%', border: '2px solid #ccc' }}
              onClick={handleImageClick}
            />
          </Col>
          <Col>
            <h4 className="mb-0">{fullName}</h4>
          </Col>
          <Col xs="auto">
            <div onClick={handleFollowingClick} className="following-info">
              <div className="fw-bold fs-4 following-number">{totalCount.followingTotalCount}</div>
              <div className="text-muted following-label">Following</div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={3} sm={6} xs={12} className="mb-3">
            <Card
              onClick={() => {
                setShowCommunities(true);
                setShowCauses(false);
                setShowSupports(false);
                setShowRequests(false);
              }}
              className="profile-card"
            >
              <Card.Body className="text-center">
                <Card.Title>Communities</Card.Title>
                <Card.Text>{totalCount.communitiesTotalCount}</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6} xs={12} className="mb-3">
            <Card
              onClick={() => {
                setShowCommunities(false);
                setShowCauses(true);
                setShowSupports(false);
                setShowRequests(false);
              }}
              className="profile-card"
            >
              <Card.Body className="text-center">
                <Card.Title>Causes</Card.Title>
                <Card.Text>{totalCount.causesTotalCount}</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6} xs={12} className="mb-3">
            <Card
              onClick={() => {
                setShowCommunities(false);
                setShowCauses(false);
                setShowSupports(true);
                setShowRequests(false);
              }}
              className="profile-card"
            >
              <Card.Body className="text-center">
                <Card.Title>Supports</Card.Title>
                <Card.Text>{totalCount.supportsTotalCount}</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6} xs={12} className="mb-3">
            <Card
              onClick={() => {
                setShowCommunities(false);
                setShowCauses(false);
                setShowSupports(false);
                setShowRequests(true);
              }}
              className="profile-card"
            >
              <Card.Body className="text-center">
                <Card.Title>Requests</Card.Title>
                <Card.Text>{totalCount.requestTotalCount}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        {showCommunities && (
          <Card className="mt-3">
            <Card.Header>Communities Joined</Card.Header>
            <Card.Body>
              {communities.length > 0 ? (
                <ul className="mb-0 list-unstyled">
                  {communities.map((community) => (
                    <li key={community.entityId} className="mb-2">
                      <Link
                        to={`/communities/${community.entityId}`}
                        className="text-decoration-none entity-link"
                      >
                        {community.entityName}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No communities joined yet.</p>
              )}
              <Paginate
                currentPage={page.communitiesPage}
                totalPages={totalPages.communitiesTotalPage}
                onPageChange={(newPage: number) =>
                  setPage((prev) => ({
                    ...prev,
                    communitiesPage: newPage,
                  }))
                }
              />
            </Card.Body>
          </Card>
        )}
        {showCauses && (
          <Card className="mt-3">
            <Card.Header>Causes Supported</Card.Header>
            <Card.Body>
              {causes.length > 0 ? (
                <ul className="mb-0 list-unstyled">
                  {causes.map((cause) => (
                    <li key={cause.entityId} className="mb-2">
                      <Link
                        to={`/causes/${cause.entityId}`}
                        className="text-decoration-none entity-link"
                      >
                        {cause.entityName}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No causes supported yet.</p>
              )}
              <Paginate
                currentPage={page.causesPage}
                totalPages={totalPages.causesTotalPage}
                onPageChange={(newPage: number) =>
                  setPage((prev) => ({
                    ...prev,
                    causesPage: newPage,
                  }))
                }
              />
            </Card.Body>
          </Card>
        )}

        {showSupports && (
          <Card className="mt-3">
            <Card.Header>Actions Contributed</Card.Header>
            <Card.Body>
              {supports.length > 0 ? (
                <ul className="mb-0 list-unstyled">
                  {supports.map((support) => (
                    <li key={support.entityId} className="mb-2">
                      <Link
                        to={`/actions/${support.entityId}`}
                        className="text-decoration-none entity-link"
                      >
                        {support.entityName}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No actions contributed yet.</p>
              )}
              <Paginate
                currentPage={page.supportsPage}
                totalPages={totalPages.supportsTotalPage}
                onPageChange={(newPage: number) =>
                  setPage((prev) => ({
                    ...prev,
                    supportsPage: newPage,
                  }))
                }
              />
            </Card.Body>
          </Card>
        )}

        {showRequests && (
          <Card className="mt-3">
            <Card.Header>Pending Requests</Card.Header>
            <Card.Body>
              {request.length > 0 ? (
                <ul className="mb-0 list-unstyled">
                  {request.map((req) => (
                    <li key={req.entityId} className="mb-2">
                      <Link
                        to={`/communities/${req.entityId}`}
                        className="text-decoration-none entity-link"
                      >
                        {req.entityName}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No pending requests.</p>
              )}
              <Paginate
                currentPage={page.requestPage}
                totalPages={totalPages.requestTotalPage}
                onPageChange={(newPage: number) =>
                  setPage((prev) => ({
                    ...prev,
                    requestPage: newPage,
                  }))
                }
              />
            </Card.Body>
          </Card>
        )}
      </Container>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Followings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {following.length > 0 ? (
            <ul className="list-unstyled mb-0">
              {following.map((f) => (
                <li key={f.followedUserId} className="mb-2">
                  <Link
                    to={`/profile/${f.followedUserId}`}
                    onClick={() => (window.location.href = `/profile/${f.followedUserId}`)}
                    className="text-decoration-none entity-link"
                  >
                    {f.fullName}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>You are not following anyone yet.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select your profile Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="text-center">
            <Col>
              <Image
                src={girlImage}
                onClick={() => handleImageSelect(girlImage)}
                style={{
                  width: '100px',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  border:
                    profileImage === girlImage ? '3px solid #007bff' : '2px solid transparent',
                  transition: 'border 0.3s',
                }}
              />
              <p className="mt-2">Woman</p>
            </Col>
            <Col>
              <Image
                src={altImage}
                onClick={() => handleImageSelect(altImage)}
                style={{
                  width: '100px',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  border: profileImage === altImage ? '3px solid #007bff' : '2px solid transparent',
                  transition: 'border 0.3s',
                }}
              />
              <p className="mt-2">Man</p>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}
