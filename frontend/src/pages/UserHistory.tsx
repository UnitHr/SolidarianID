import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Modal,
  Button,
  Tooltip,
  OverlayTrigger,
} from 'react-bootstrap';
import { SolidarianNavbar } from '../components/SolidarianNavbar';
import girlImage from '../assets/chica-solidarianid.png';
import altImage from '../assets/chico.png';
import '../styles/links.css';

type HistoryEntry = {
  type: string;
  entityId: string;
  entityName: string;
  timestamp: string;
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
  const navigate = useNavigate();
  const [history, setHistory] = useState<{ [key: string]: HistoryEntry[] }>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [followingEntries, setFollowingEntries] = useState<HistoryEntry[]>([]);

  const [profileImage, setProfileImage] = useState(girlImage);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);

    setUser(parsedUser);

    async function fetchHistory() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/users/${parsedUser.userId}/history`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${parsedUser.token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const groupedData = data.data.reduce(
            (acc: { [key: string]: HistoryEntry[] }, entry: HistoryEntry) => {
              if (!acc[entry.type]) {
                acc[entry.type] = [];
              }
              acc[entry.type].push(entry);
              return acc;
            },
            {}
          );
          setHistory(groupedData);
        } else {
          console.error('Error fetching history');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [navigate]);

  const followingCount = history['USER_FOLLOWED'] ? history['USER_FOLLOWED'].length : 0;

  const categories = [
    { label: 'Communities', keys: ['COMMUNITY_ADMIN', 'JOINED_COMMUNITY'] },
    { label: 'Pending Request', keys: ['JOIN_COMMUNITY_REQUEST_SENT'] },
    { label: 'Causes Supported', keys: ['CAUSE_SUPPORT'] },
    { label: 'Action Contributed', keys: ['ACTION_CONTRIBUTED'] },
  ];

  const handleFollowingClick = () => {
    setFollowingEntries(history['USER_FOLLOWED'] || []);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleImageClick = () => setShowImageModal(true);

  const handleImageSelect = (image: string) => {
    setProfileImage(image);
    setShowImageModal(false);
  };

  if (loading || !user) {
    return <p>Loading...</p>;
  }

  const getRouteBase = (entryType: string) => {
    switch (entryType) {
      case 'COMMUNITY_ADMIN':
      case 'JOINED_COMMUNITY':
        return 'communities';
      case 'CAUSE_SUPPORT':
        return 'causes';
      case 'ACTION_CONTRIBUTED':
        return 'actions';
      case 'JOIN_COMMUNITY_REQUEST_SENT':
        return 'requests';
      case 'USER_FOLLOWED':
        return 'users';
      default:
        return 'entity';
    }
  };

  return (
    <>
      <SolidarianNavbar />
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
            <h4 className="mb-0">
              {user.firstName} {user.lastName}
            </h4>
          </Col>
          <Col xs="auto">
            <div
              onClick={handleFollowingClick}
              style={{
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'color 0.3s',
              }}
              className="following-info"
            >
              <div className="fw-bold fs-4 following-number">{followingCount}</div>
              <div className="text-muted following-label">Following</div>
            </div>
          </Col>
        </Row>

        <Row>
          {categories.map(({ label, keys }) => {
            const count = keys.reduce((total, key) => total + (history[key]?.length || 0), 0);
            return (
              <Col md={3} sm={6} xs={12} key={label} className="mb-3">
                <Card
                  onClick={() => {
                    const newActive = activeCategory === label ? null : label;
                    setActiveCategory(newActive);
                  }}
                  style={{
                    cursor: 'pointer',
                    minHeight: '115px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Card.Body className="text-center">
                    <Card.Title>{label}</Card.Title>
                    <Card.Text>{count}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>

        {activeCategory && (
          <Row className="mt-3">
            <Col>
              <Card style={{ border: '1px solid #ccc', borderBottom: '4px solid #007bff' }}>
                <Card.Body>
                  <h5 style={{ marginBottom: '30px' }}>{activeCategory} Details</h5>
                  <ul className="list-unstyled">
                    {categories
                      .find((cat) => cat.label === activeCategory)
                      ?.keys.flatMap((key) => history[key] || [])
                      .map((entry) => (
                        <li key={entry.entityId} className="mb-3">
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-${entry.entityId}`}>Show details</Tooltip>
                            }
                          >
                            <Link
                              to={`/${getRouteBase(entry.type)}/${entry.entityId}`}
                              className="entity-link ps-3"
                            >
                              {entry.entityName}
                            </Link>
                          </OverlayTrigger>
                        </li>
                      ))}

                    {categories
                      .find((cat) => cat.label === activeCategory)
                      ?.keys.flatMap((key) => history[key] || []).length === 0 && (
                      <p className="mt-3 text-muted">No items available for this category.</p>
                    )}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Following Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-unstyled">
            {followingEntries.length > 0 ? (
              followingEntries.map((entry) => (
                <li key={entry.entityId} className="mb-3">
                  <Link
                    to={`/${getRouteBase(entry.type)}/${entry.entityId}`}
                    className="entity-link"
                  >
                    {entry.entityName}
                  </Link>
                </li>
              ))
            ) : (
              <p>No following entries available.</p>
            )}
          </ul>
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
