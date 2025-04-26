import { Col, Container, Row, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import odsImages from '../utils/odsImages';
import '../styles/links.css';
import { Paginate } from '../components/Pagination';
import { ThumbsUp } from 'lucide-react';

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

type User = {
  userId: string;
  firstName: string;
  lastName: string;
  roles: string[];
  token: string;
  exp: number;
};

export function CauseDetails() {
  const navigate = useNavigate();
  const { causeId } = useParams();
  const [cause, setCause] = useState<CauseDetails | null>(null);
  const [community, setCommunity] = useState<CommunityDetails | null>(null);
  const [actions, setActions] = useState<ActionDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string | null>(null);
  const limit = 6;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasSupported, setHasSupported] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();

    return `${formattedDate} at ${formattedTime}`;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    if (!causeId) {
      return;
    }

    async function fetchCauseDetails(causeId: string) {
      try {
        const cause = await fetch(`http://localhost:3000/api/v1/causes/${causeId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!cause.ok) {
          throw new Error('Error fetching community details');
        }

        const data = await cause.json();
        setCause(data);

        //Get supporters of the cause
        const supportersResponse = await fetch(
          `http://localhost:3000/api/v1/causes/${causeId}/supporters`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!supportersResponse.ok) {
          throw new Error('Error fetching supporters of cause');
        }
        const supportersData = await supportersResponse.json();
        setHasSupported(supportersData.data.includes(parsedUser.userId));
        setSupportCount(supportersData.data.length);

        //Get creator of the cause
        const creator = await fetch(`http://localhost:3000/api/v1/users/${data.createdBy}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!creator.ok) {
          throw new Error('Error fetching creator details');
        }
        const creatorData = await creator.json();
        setFullName(`${creatorData.firstName} ${creatorData.lastName}`);

        //Get community of the cause
        const community = await fetch(
          `http://localhost:3000/api/v1/communities/${data.communityId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!community.ok) {
          throw new Error('Error fetching community details');
        }
        const communityData = await community.json();
        setCommunity(communityData.data);

        //Get actions of the cause
        const actions = await fetch(
          `http://localhost:3000/api/v1/causes/${causeId}/actions?page=${page}&limit=${limit}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!actions.ok) {
          throw new Error('Error fetching actions of cause');
        }

        const actionsData = await actions.json();

        setTotalPages(actionsData.meta.totalPages);

        const detailRequests = actionsData.data.map((id: string) =>
          fetch(`http://localhost:3000/api/v1/actions/${id}`).then((res) => res.json())
        );

        const entityDetails = await Promise.all(detailRequests);
        setActions(entityDetails);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCauseDetails(causeId);
  }, [causeId, page]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSupport = async () => {
    if (!causeId || hasSupported || !user?.userId) return;

    try {
      const res = await fetch(`http://localhost:3000/api/v1/causes/${causeId}/supporters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) throw new Error('Error supporting the cause');

      setHasSupported(true);
      setSupportCount((prev) => prev + 1);
    } catch (err) {
      console.error('Support error:', err);
    }
  };

  return (
    <>
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
                              width: '100px',
                              borderRadius: '8px',
                              border: '2px solid #ddd',
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
                        overlay={<Tooltip id={`tooltip-ods-${community?.id}`}>Community</Tooltip>}
                      >
                        <Link
                          to={`/communities/${community?.id}`}
                          className="fw-bold text-decoration-none entity-link"
                        >
                          {community?.name}
                        </Link>
                      </OverlayTrigger>
                    </p>
                  </Col>
                </Row>

                <div className="text-end mb-4">
                  <ThumbsUp
                    size={28}
                    style={{ cursor: hasSupported ? 'default' : 'pointer' }}
                    color={hasSupported ? '#facc15' : '#a3a3a3'}
                    fill={hasSupported ? '#facc15' : 'none'}
                    onClick={!hasSupported ? handleSupport : undefined}
                  />
                  <p className="mt-2 text-muted text-end">{supportCount} Supports</p>
                </div>
                <hr className="my-4" />

                <Row>
                  <Col>
                    <p>
                      <strong>Created by:</strong> {fullName}
                    </p>
                    <p>
                      <strong>Created on:</strong> {formatDate(cause.createdAt)}
                    </p>
                    <p>
                      <strong>End date:</strong> {formatDate(cause.endDate)}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h4 className="mt-3 mb-3 ">Description</h4>
                    <p>{cause.description}</p>
                    <hr className="my-4" />
                    <Row className="align-items-center justify-content-between mb-3">
                      <Col xs="auto">
                        <h4 className="mb-0">Related Actions</h4>
                      </Col>
                      <Col xs="auto">
                        <button
                          className="btn btn-primary w-100"
                          onClick={() => navigate(`/causes/${causeId}/actions/new`)}
                        >
                          + Create Action
                        </button>
                      </Col>
                    </Row>
                    {actions.length > 0 && (
                      <>
                        {actions.map((action) => (
                          <div key={action.id} className="mb-4">
                            <h5>
                              <OverlayTrigger
                                placement="top"
                                overlay={
                                  <Tooltip id={`tooltip-${action.id}`}>Show details</Tooltip>
                                }
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
              <p>Data not found.</p>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
