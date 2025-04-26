import { Col, Container, Row, Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import odsImages from '@/utils/odsImages';
import { Paginate } from '@/components/Pagination';
import { ThumbsUp } from 'lucide-react';
import { GetServerSideProps } from 'next';


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

type User = {
  userId: string;
  firstName: string;
  lastName: string;
  roles: string[];
  token: string;
  exp: number;
};

type ActionDetails = {
  id: string;
  title: string;
  description: string;
  causeId: string;
  status: string;
};

export default function CauseDetailsPage({
  initialCauseData,
  initialCommunityData,
  initialFullName,
  initialSupportCount,
}: any) {
  const router = useRouter();
  const { causeId } = router.query;

  const [cause] = useState<CauseDetails>(initialCauseData);
  const [actions, setActions] = useState<ActionDetails[]>([]);
  const [community] = useState(initialCommunityData);
  const [supportCount, setSupportCount] = useState(initialSupportCount);
  const [hasSupported, setHasSupported] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 2; 
  const [isLoadingActions, setIsLoadingActions] = useState(false); 
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let userData = Cookies.get('user'); 
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
  
      setIsClientLoaded(true);
    }
  }, []);

  useEffect(() => {
    const fetchActions = async () => {
      setIsLoadingActions(true);
      try {
        const res = await fetch(`http://localhost:3000/api/v1/causes/${causeId}/actions?page=${currentPage}&limit=2`);
        
        if (!res.ok) throw new Error('Error fetching actions');

        const data = await res.json();
        setTotalPages(data.meta.totalPages);
        
        const detailRequests = data.data.map((id: any) =>
          fetch(`http://localhost:3000/api/v1/actions/${id}`).then((res) => res.json())
        );
        const detailedActions = await Promise.all(detailRequests);
  
        setActions(detailedActions);
      } catch (error) {
        console.error('Error fetching actions:', error);
      } finally {
        setIsLoadingActions(false);
      }
    };

    if (causeId) {
      fetchActions();
    }
  }, [currentPage, causeId]);
  
  const handleSupport = async () => {
    if (!causeId || hasSupported) return;
    if (!user) {
      alert('You need to be logged in to support a cause.');
      return;
    }
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
      setSupportCount((prev: number) => prev + 1);
    } catch (err) {
      console.error('Support error:', err);
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={12}>
          {cause ? (
            <div>
              <Row className="justify-content-center mb-5">
                {cause.ods && cause.ods.length > 0 &&
                  cause.ods.map((odsItem) => (
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
                        overlay={<Tooltip id={`tooltip-ods-${odsItem.id}`}>{odsItem.title}: {odsItem.description}</Tooltip>}
                      >
                        <Image
                          src={odsImages[odsItem.id].src}
                          alt={odsItem.title}
                          className="img-fluid"
                          width={100}
                          height={100}
                          style={{
                            borderRadius: '8px',
                            border: '2px solid #ddd',
                          }}
                          loading="lazy"
                        />
                      </OverlayTrigger>
                    </Col>
                  ))
                }
              </Row>
              <h2 className="text-center">{initialCauseData.title}</h2>
              {community && (
                <p className="text-center text-muted mt-3">
                  <a
                    href={`http://localhost:5173/communities/${community.id}`}
                    rel="noopener noreferrer"
                    className="fw-bold text-decoration-none"
                  >
                    {community.name}
                  </a>
                </p>
              )}
              <div className="text-end mb-4">
                {user && (
                  <>
                    <ThumbsUp
                      size={28}
                      style={{ cursor: hasSupported ? 'default' : 'pointer' }}
                      color={hasSupported ? '#facc15' : '#a3a3a3'}
                      fill={hasSupported ? '#facc15' : 'none'}
                      onClick={!hasSupported ? handleSupport : undefined}
                    />
                    <p className="mt-2 text-muted text-end">{supportCount} Supports</p>
                  </>
                )}
              </div>
              <hr />
              <Row>
                <Col>
                  <p><strong>Created by:</strong> {initialFullName}</p>
                  <p><strong>Created on:</strong> {formatDate(cause.createdAt)}</p>
                  <p><strong>End date:</strong> {formatDate(cause.endDate)}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4>Description</h4>
                  <p>{cause.description}</p>
                  {isLoadingActions ? (
                    <p>Loading actions...</p>
                  ) : (
                    actions.length > 0 && (
                      <>
                        <h4 className="mt-5">Actions</h4>
                        {actions.map((action: any) => (
                          <div key={action.id} className="mb-4">
                            <h5>
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id={`tooltip-${action.id}`}>Show details</Tooltip>}
                              >
                                <a
                                  href={`http://localhost:5173/actions/${action.id}`}
                                  rel="noopener noreferrer"
                                  className="entity-link"
                                >
                                  {action.title}
                                </a>
                              </OverlayTrigger>
                            </h5>
                            <p>{action.description}</p>
                            <p>Status: {action.status}</p>
                          </div>
                        ))}
                        <Paginate
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={(newPage) => setCurrentPage(newPage)}
                        />
                      </>
                    )
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
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const causeId = context.params?.causeId;

  if (!causeId) {
    return {
      notFound: true,
    };
  }

  const causeResponse = await fetch(`http://localhost:3000/api/v1/causes/${causeId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!causeResponse.ok) {
    return {
      notFound: true,
    };
  }

  const causeData = await causeResponse.json();

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
    return {
      notFound: true,
    };
  }

  const supportersData = await supportersResponse.json();

  const creatorResponse = await fetch(`http://localhost:3000/api/v1/users/${causeData.createdBy}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!creatorResponse.ok) {
    return {
      notFound: true,
    };
  }

  const creatorData = await creatorResponse.json();

  const communityResponse = await fetch(
    `http://localhost:3000/api/v1/communities/${causeData.communityId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!communityResponse.ok) {
    return {
      notFound: true,
    };
  }

  const communityData = await communityResponse.json(); 

  return {
    props: {
      initialCauseData: causeData,
      initialCommunityData: communityData.data,
      initialFullName: `${creatorData.firstName} ${creatorData.lastName}`,
      initialSupportCount: supportersData.data.length,
    },
  };
};