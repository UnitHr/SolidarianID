import { Col, Container, Row, OverlayTrigger, Tooltip, ProgressBar } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

type ActionDetails = {
  id: string;
  title: string;
  description: string;
  causeId: string;
  status: string;
  type: string;
  target: string;
  unit: string;
  achieved: string;
};

type CauseDetails = {
  id: string;
  title: string;
};

export function ActionDetails() {
  const { actionId } = useParams();
  const [action, setAction] = useState<ActionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [cause, setCause] = useState<CauseDetails | null>(null);

  useEffect(() => {
    if (!actionId) return;

    const fetchActionDetails = async () => {
      try {
        const action = await fetch(`http://localhost:3000/api/v1/actions/${actionId}`);
        if (!action.ok) {
          throw new Error('Error fetching action details');
        }
        const data = await action.json();
        setAction(data);

        const cause = await fetch(`http://localhost:3000/api/v1/causes/${data.causeId}`);
        if (!cause.ok) {
          throw new Error('Error fetching cause details');
        }
        const causeData = await cause.json();
        setCause(causeData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchActionDetails();
  }, [actionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Cálculo del progreso
  const achieved = parseFloat(action?.achieved ?? '0');
  const target = parseFloat(action?.target ?? '1');
  const percentage = Math.min(Math.round((achieved / target) * 100), 100);

  return (
    <>
      <Container className="mt-4">
        <Row className="justify-content-center mb-3">
          <Col xs={12} md={9}>
            <h2 className="mb-1 text-center">{action?.title}</h2>
            <p className="text-center text-muted mt-3">
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-cause-${action?.causeId}`}>See cause details</Tooltip>
                }
              >
                <Link
                  to={`/causes/${action?.causeId}`}
                  className="fw-bold text-decoration-none entity-link"
                >
                  {cause?.title}
                </Link>
              </OverlayTrigger>
            </p>
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col>
            <p>
              <strong>Status:</strong> <span className="text-capitalize">{action?.status}</span>
            </p>
            <p>
              <strong>Type:</strong> <span className="text-capitalize">{action?.type}</span>
            </p>
            <p>
              <strong>Target:</strong> {action?.target} {action?.unit}
            </p>
            <p>
              <strong>Achieved:</strong> {action?.achieved} {action?.unit}
            </p>
            <ProgressBar
              now={percentage}
              label={`${percentage}%`}
              striped
              variant={percentage === 100 ? 'success' : 'info'}
              className="mt-2"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <h4 className="mt-4 mb-3">Description</h4>
            <p>{action?.description}</p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
