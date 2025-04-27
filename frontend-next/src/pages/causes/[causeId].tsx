import { Col, Container, Row, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Paginate } from '@/components/Pagination';
import { ThumbsUp } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { ActionCard } from '@/components/ActionCard';
import { ActionStatusEnum, ActionTypeEnum } from '@/lib/types/action.types';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import odsImages from '@/utils/odsImages';
import '../../styles/cause.css';

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
  initialUser,
  initialSupportCount,
  initialHasSupported,
}: any) {
  const router = useRouter();
  const { causeId } = router.query;

  const [cause] = useState<CauseDetails>(initialCauseData);
  const [actions, setActions] = useState<ActionDetails[]>([]);
  const [community] = useState(initialCommunityData);
  const [user, setUser] = useState<User | null>(initialUser);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 2;

  const [hasSupported, setHasSupported] = useState(initialHasSupported);
  const [supportCount, setSupportCount] = useState(initialSupportCount);
  const [isLoadingActions, setIsLoadingActions] = useState(false);

  useEffect(() => {
    const fetchActions = async () => {
      setIsLoadingActions(true);
      try {
        const res = await fetch(`http://localhost:3000/api/v1/causes/${causeId}/actions?page=${currentPage}&limit=${limit}`);

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
    if (!causeId) return;

    if (hasSupported) return;

    if (!user) {
      alert('You need to be logged in to support this cause.');
      return;

    } else {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/causes/${causeId}/supporters`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to support the cause');
        };

        setHasSupported(true);
        setSupportCount((prev: number) => prev + 1);
      } catch (err) {
        console.error('Support error:', err);
      }
    }

  };

  return (
    <Container className="py-5">
      {/* Header */}
      <Row className="justify-content-center text-center mb-4">
        <Col md={8}>
          <h5 className="text-muted mb-2">Cause Details</h5>
          <h2 className="fw-bold mb-3">{cause.title}</h2>
          {community && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="tooltip-community">View Community</Tooltip>}
            >
              <a
                href={`http://localhost:5173/communities/${community.id}`} className="text-primary fw-semibold text-decoration-none d-inline-flex align-items-center gap-2"
              >
                ← {community.name}
              </a>
            </OverlayTrigger>
          )}
        </Col>
      </Row>

      {/* Support */}
      <div className="d-flex justify-content-end align-items-center gap-2 mb-5">
        <ThumbsUp
          size={28}
          style={{ cursor: hasSupported ? 'default' : 'pointer' }}
          color={hasSupported ? '#facc15' : '#a3a3a3'}
          fill={hasSupported ? '#facc15' : 'none'}
          onClick={handleSupport}
        />
        <span className="text-muted">{supportCount} Supports</span>
      </div>

      <hr className="my-4" />

      {/* Cause Info */}
      <Row className="justify-content-center text-center mb-5">
        <Col md={8}>
          <h5 className="fw-semibold mb-4">Cause Information</h5>

          <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
            <Button variant="outline-primary" disabled>
              👤 {initialFullName}
            </Button>
            <Button variant="outline-secondary" disabled>
              🗓️ {cause.createdAt}
            </Button>
            <Button variant="outline-secondary" disabled>
              ⏳ {cause.endDate}
            </Button>
          </div>

          {/* ODS Images */}
          {cause.ods.length > 0 && (
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
              {cause.ods.map((ods) => (
                <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-ods-${ods.id}`}>{ods.title}: {ods.description}</Tooltip>}
                >
                  <div className='image-container'>
                    <Image
                          src={odsImages[ods.id].src}
                          alt={ods.title}
                          className="img-fluid image-border"
                          width={100}
                          height={100}
                          loading="lazy"
                        />
                  </div>
                </OverlayTrigger>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="text-muted mt-4">{cause.description}</p>
        </Col>
      </Row>

      <hr className="my-4" />

      {/* Related Actions */}
      <Row className="align-items-center justify-content-between mb-4">
        <Col xs="auto">
          <h4 className="fw-semibold mb-0">Related Actions</h4>
        </Col>
      </Row>

      {/* Actions List */}
      <Row className="g-4">
        {isLoadingActions ? (
          <Col className="text-center py-5">
            <div>Loading actions...</div>
          </Col>
        ) : actions.length > 0 ? (
          actions.map((action) => (
            <Col key={action.id} xs={12} md={6} lg={4}>
              <ActionCard
                type={ActionTypeEnum.VOLUNTEER}
                target={0}
                unit={''}
                achieved={0}
                createdAt={''}
                updatedAt={''}
                {...action}
                status={action.status as ActionStatusEnum}
              />
            </Col>
          ))
        ) : (
          <Col className="text-center text-muted py-5">
            <p>No actions found for this cause.</p>
          </Col>
        )}
      </Row>

      {/* Pagination */}
      {actions.length > 0 && (
        <Row className="mt-4">
          <Col className="d-flex justify-content-center">
            <Paginate
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(newPage) => setCurrentPage(newPage)}
            />
          </Col>
        </Row>
      )}
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

  const cookies = context.req.cookies;
  const userData = cookies.user ? JSON.parse(cookies.user) : null;

  // Fetch cause data
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
  const formattedCauseData = {
    ...causeData,
    createdAt: format(parseISO(causeData.createdAt), 'yyyy-MM-dd'),
    endDate: format(parseISO(causeData.endDate), 'yyyy-MM-dd'),
  };

  // Fetch all supporters data (paginated)
  let allSupporters: string[] = [];
  let currentPage = 1;
  const limit = 10;

  while (true) {
    const supportersResponse = await fetch(
      `http://localhost:3000/api/v1/causes/${causeId}/supporters?page=${currentPage}&limit=${limit}`,
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
    allSupporters = [...allSupporters, ...supportersData.data];

    // Check if we have fetched all pages
    if (currentPage >= supportersData.meta.totalPages) {
      break;
    }

    currentPage++;
  }

  const userId = userData?.userId || null;
  const hasSupported = userId ? allSupporters.includes(userId) : false;

  // Fetch community data
  const communityResponse = await fetch(`http://localhost:3000/api/v1/communities/${causeData.communityId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!communityResponse.ok) {
    return {
      notFound: true,
    };
  }
  const communityData = await communityResponse.json();

  // Fetch creator data
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
  return {
    props: {
      initialCauseData: formattedCauseData,
      initialCommunityData: communityData.data,
      initialFullName: `${creatorData.firstName} ${creatorData.lastName}`,
      initialUser: userData,
      initialSupportCount: allSupporters.length,
      initialHasSupported: hasSupported,
    },
  };
};