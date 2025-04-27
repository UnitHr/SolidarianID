import { Button, Card, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  ActionStatusEnum,
  ActionStatusLabels,
  ActionTypeEnum,
  ActionTypeLabels,
} from '../lib/types/action.types';

interface ActionCardProps {
  id: string;
  title: string;
  description: string;
  achieved: number;
  target: number;
  status: ActionStatusEnum;
  type: ActionTypeEnum;
}

export function ActionCard({
  id,
  title,
  description,
  achieved,
  target,
  status,
  type,
}: ActionCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!id) {
      console.error('No ID found for action:', { id, title, description });
      return;
    }
    navigate(`/actions/${id}`);
  };

  const getStatusVariant = (status: ActionStatusEnum) => {
    switch (status) {
      case ActionStatusEnum.IN_PROGRESS:
        return 'info'; // blue
      case ActionStatusEnum.COMPLETED:
        return 'success'; // green
      case ActionStatusEnum.PENDING:
      default:
        return 'warning'; // yellow
    }
  };

  // Calculate progress percentage
  const progress = target > 0 ? Math.min((achieved / target) * 100, 100) : 0;

  return (
    <Card className="h-100 shadow-sm" style={{ transition: 'transform 0.2s' }}>
      <Card.Body className="d-flex flex-column p-3">
        {/* Title */}
        <Card.Title className="fs-5 mb-2">{title}</Card.Title>

        {/* Description */}
        <Card.Text className="text-muted small flex-grow-1">{description}</Card.Text>

        {/* Progress */}
        <div className="my-3">
          <ProgressBar now={progress} variant={getStatusVariant(status as ActionStatusEnum)} />
        </div>

        {/* Status buttons */}
        <div className="d-flex justify-content-between gap-2 my-2">
          <Button
            variant={getStatusVariant(status as ActionStatusEnum)}
            size="sm"
            disabled
            className="flex-grow-1"
          >
            {ActionStatusLabels[status as ActionStatusEnum]}
          </Button>
          <Button variant="outline-secondary" size="sm" disabled className="flex-grow-1">
            {ActionTypeLabels[type as ActionTypeEnum]}
          </Button>
        </div>

        {/* Details button */}
        <div className="d-grid mt-2">
          <Button variant="secondary" size="sm" onClick={handleClick}>
            See details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
