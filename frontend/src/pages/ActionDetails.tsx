import {
  Container,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  ProgressBar,
  Button,
  Modal,
  Form,
} from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ActionStatusEnum,
  ActionStatusLabels,
  ActionTypeLabels,
  type ActionDetails,
} from '../lib/types/action.types';
import { CauseDetails } from '../lib/types/cause.types';
import { User } from '../lib/types/user.types';
import { contributeAction, fetchActionById } from '../services/action.service';
import { fetchCauseById } from '../services/cause.service';
import { getStoredUser } from '../services/user.service';
import { ArrowLeft } from 'lucide-react';

export function ActionDetails() {
  const navigate = useNavigate();

  const { actionId } = useParams();
  const [action, setAction] = useState<ActionDetails | null>(null);
  const [cause, setCause] = useState<CauseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [amount, setAmount] = useState('');
  const [date] = useState(new Date().toISOString().split('T')[0]);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }

    if (actionId) {
      loadActionData(actionId);
    }
  }, [actionId]);

  const loadActionData = async (id: string) => {
    try {
      setLoading(true);

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

  const handleOpenModal = () => {
    if (!user) {
      alert('You need to be logged in to contribute.');
      navigate('/login');
      return;
    }

    if (action?.status === ActionStatusEnum.COMPLETED) {
      alert('This action is already completed. No more contributions allowed.');
      return;
    }
    setShowModal(true);
  };

  const handleSubmitContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionId || !action || !user) return;

    try {
      await contributeAction(actionId, {
        date,
        amount: Number(amount),
        unit: action.unit,
      });

      setShowModal(false);
      setAmount('');

      // Reload action data to reflect the new contribution
      await loadActionData(actionId);
    } catch (error) {
      console.error('Contribution failed:', error);
      alert('Contribution failed. Please try again.');
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
        <Row className="justify-content-center text-center mb-4">
          <Col md={8}>
            <h4 className="fw-semibold mb-3">Description</h4>
            <p className="text-muted">{action.description}</p>
          </Col>
        </Row>

        {/* Contribute Button (only if not completed) */}
        {user && action.status !== ActionStatusEnum.COMPLETED && (
          <Row className="justify-content-center">
            <Col md={4} className="d-flex justify-content-center">
              <Button onClick={handleOpenModal} variant="primary">
                + Contribute
              </Button>
            </Col>
          </Row>
        )}
      </Container>

      {/* Modal for Contribution */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Contribute to {action.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitContribution}>
            <Form.Group className="mb-3">
              <Form.Label>Amount ({action.unit})</Form.Label>
              <Form.Control
                type="number"
                min={1}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit">
                Confirm Contribution
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
