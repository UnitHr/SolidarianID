import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Col, Container, Row, Image, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { ArrowLeft, ThumbsUp } from 'lucide-react';
import { CauseDetails as CauseType } from '../lib/types/cause.types';
import { ActionDetails } from '../lib/types/action.types';
import { CommunityDetails } from '../lib/types/community.types';
import { User } from '../lib/types/user.types';
import {
  fetchActionsByCauseId,
  fetchCauseById,
  fetchCauseSupporters,
  supportCause,
} from '../services/cause.service';
import { fetchUserById, getStoredUser } from '../services/user.service';
import { getCommunityById } from '../services/community.service';
import { Paginate } from '../components/Pagination';
import { ActionCard } from '../components/ActionCard';
import odsImages from '../utils/odsImages';

export function CauseDetails() {
  const navigate = useNavigate();

  const { causeId } = useParams();
  const [cause, setCause] = useState<CauseType | null>(null);
  const [community, setCommunity] = useState<CommunityDetails | null>(null);
  const [actions, setActions] = useState<ActionDetails[]>([]);
  const [fullName, setFullName] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasSupported, setHasSupported] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    // Check if user is logged in
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }

    // Load cause data
    if (causeId) {
      loadData(causeId, storedUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [causeId, page]);

  const loadData = async (causeId: string, user: User | null) => {
    try {
      const [causeData, supporterIds, actionsData] = await Promise.all([
        fetchCauseById(causeId),
        fetchCauseSupporters(causeId),
        fetchActionsByCauseId(causeId, page, 6),
      ]);

      setCause(causeData);
      setActions(actionsData.actions);
      setTotalPages(actionsData.totalPages);
      setSupportCount(supporterIds.length);

      const [creatorData, communityData] = await Promise.all([
        fetchUserById(causeData.createdBy),
        getCommunityById(causeData.communityId),
      ]);

      setFullName(`${creatorData.firstName} ${creatorData.lastName}`);
      setCommunity(communityData);

      // Check if user is a supporter
      if (user) {
        setHasSupported(supporterIds.includes(user.userId));
      }
    } catch (error) {
      console.error('Error loading cause details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSupport = async () => {
    if (!causeId) return;

    // Redirect to login if user is not logged in
    if (!user) {
      navigate('/login');
      return;
    }

    if (hasSupported) return;

    try {
      await supportCause(causeId);
      setHasSupported(true);
      setSupportCount((prev) => prev + 1);
    } catch (err) {
      console.error('Support error:', err);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div>Loading...</div>
      </Container>
    );
  }

  if (!cause) {
    return (
      <Container className="py-5 text-center">
        <h4>Cause not found</h4>
      </Container>
    );
  }

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
              overlay={<Tooltip id="tooltip-community">See Community Details</Tooltip>}
            >
              <Link
                to={`/communities/${community.id}`}
                className="d-inline-flex align-items-center gap-2 text-primary fw-semibold text-decoration-none"
              >
                <ArrowLeft size={18} />
                {community.name}
              </Link>
            </OverlayTrigger>
          )}
        </Col>
      </Row>

      {/* Support Section */}
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
            <Button
              variant="outline-primary"
              disabled
              className="d-flex align-items-center gap-2 px-3"
            >
              👤 {fullName || 'Unknown'}
            </Button>
            <Button
              variant="outline-secondary"
              disabled
              className="d-flex align-items-center gap-2 px-3"
            >
              🗓️ {formatDate(cause.createdAt)}
            </Button>
            <Button
              variant="outline-secondary"
              disabled
              className="d-flex align-items-center gap-2 px-3"
            >
              ⏳ {formatDate(cause.endDate)}
            </Button>
          </div>

          {/* ODS Images */}
          {cause.ods.length > 0 && (
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
              {cause.ods.map((ods) => (
                <OverlayTrigger
                  key={ods.id}
                  placement="top"
                  overlay={<Tooltip id={`tooltip-ods-${ods.id}`}>{ods.title}</Tooltip>}
                >
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: '60px',
                      height: '60px',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      border: '1px solid #eee',
                      cursor: 'pointer',
                    }}
                  >
                    <Image src={odsImages[ods.id]} alt={ods.title} className="img-fluid" />
                  </div>
                </OverlayTrigger>
              ))}
            </div>
          )}

          {/* Descripción */}
          <p className="text-muted mt-4">{cause.description}</p>
        </Col>
      </Row>

      <hr className="my-4" />

      {/* Related Actions */}
      <Row className="align-items-center justify-content-between mb-4">
        <Col xs="auto">
          <h4 className="fw-semibold mb-0">Related Actions</h4>
        </Col>
        {user && ( // Show button only if user is logged in
          <Col xs="auto">
            <Button onClick={() => navigate(`/causes/${causeId}/actions/new`)}>
              + Create Action
            </Button>
          </Col>
        )}
      </Row>

      {/* Actions List */}
      <Row className="g-4">
        {actions && actions.length > 0 ? (
          actions.map((action) => (
            <Col key={action.id} xs={12} md={6} lg={4}>
              <ActionCard {...action} />
            </Col>
          ))
        ) : (
          <Col className="text-center text-muted py-5">
            <p>No actions found for this cause.</p>
          </Col>
        )}
      </Row>

      {/* Pagination */}
      {actions && actions.length > 0 && (
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
  );
}
