import { Container, Row, Col, OverlayTrigger, Tooltip, ProgressBar, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ActionStatusEnum,
  ActionStatusLabels,
  ActionTypeLabels,
  type ActionDetails,
} from '../lib/types/action.types';
import { CauseDetails } from '../lib/types/cause.types';
import { fetchActionById } from '../services/action.service';
import { fetchCauseById } from '../services/cause.service';
import { ArrowLeft } from 'lucide-react';

export function ActionDetails() {
  const { actionId } = useParams();

  const [action, setAction] = useState<ActionDetails | null>(null);
  const [cause, setCause] = useState<CauseDetails | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (actionId) {
      loadActionData(actionId);
    }
  }, [actionId]);

  const loadActionData = async (id: string) => {
    try {
      setLoading(true);

      // Call services
      const [actionRes, causeRes] = await Promise.all([
        fetchActionById(id),
        (async () => {
          const fetchedAction = await fetchActionById(id);
          return fetchCauseById(fetchedAction.causeId);
        })(),
      ]);

      setAction(actionRes);
      setCause(causeRes);
    } catch (err) {
      console.error('Error loading action details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div>Loading...</div>
      </Container>
    );
  }

  if (!action) {
    return (
      <Container className="py-5 text-center">
        <h4>Action not found</h4>
      </Container>
    );
  }

  // Calculate progress
  const achieved = action.achieved ?? 0;
  const target = action.target ?? 1;
  const progress = Math.min(Math.round((achieved / target) * 100), 100);

  const progressVariant =
    action.status === ActionStatusEnum.COMPLETED
      ? 'success'
      : action.status === ActionStatusEnum.IN_PROGRESS
        ? 'info'
        : 'warning';

  return (
    <>
      <Container className="py-5">
        {/* Header */}
        <Row className="justify-content-center text-center mb-4">
          <Col md={8}>
            <h5 className="text-muted mb-2">Action Details</h5>
            <h2 className="fw-bold mb-3">{action.title}</h2>

            {cause && (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-cause">See Cause Details</Tooltip>}
              >
                <Link
                  to={`/causes/${cause.id}`}
                  className="d-inline-flex align-items-center gap-2 text-primary fw-semibold text-decoration-none"
                >
                  <ArrowLeft size={18} />
                  {cause.title}
                </Link>
              </OverlayTrigger>
            )}
          </Col>
        </Row>

        {/* Status and Type */}
        <Row className="justify-content-center mb-4">
          <Col md={6} className="d-flex gap-2 justify-content-center">
            <Button variant={progressVariant} disabled className="flex-grow-1">
              {ActionStatusLabels[action.status]}
            </Button>

            <Button variant="outline-secondary" disabled className="flex-grow-1">
              {ActionTypeLabels[action.type]}
            </Button>
          </Col>
        </Row>

        {/* Achieved - Progress - Target */}
        <Row className="align-items-center text-center mb-5">
          <Col xs={4}>
            <h6 className="mb-1">Achieved</h6>
            <p className="text-muted">
              {action.achieved} {action.unit}
            </p>
          </Col>

          <Col xs={4}>
            <ProgressBar
              now={progress}
              label={`${progress}%`}
              striped
              variant={progressVariant}
              style={{ height: '1.5rem' }}
            />
          </Col>

          <Col xs={4}>
            <h6 className="mb-1">Target</h6>
            <p className="text-muted">
              {action.target} {action.unit}
            </p>
          </Col>
        </Row>

        {/* Description */}
        <Row className="justify-content-center">
          <Col md={8}>
            <h4 className="fw-semibold mb-3">Description</h4>
            <p className="text-muted">{action.description}</p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
