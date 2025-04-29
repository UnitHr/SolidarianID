import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getUserNameById } from '../services/user.service';
import { approveCommunityRequest, rejectCommunityRequest } from '../services/community.service';

interface CreateCommunityRequestCardProps {
  requestId: string;
  communityName: string;
  communityDescription: string;
  userId: string;
  causeTitle: string;
  causeDescription: string;
  causeEndDate: string;
  causeOds: { title: string }[];
}

export const CreateCommunityRequestCard: React.FC<CreateCommunityRequestCardProps> = ({
  requestId,
  communityName,
  communityDescription,
  userId,
  causeTitle,
  causeDescription,
  causeEndDate,
  causeOds,
}) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      const name = await getUserNameById(userId);
      setUserName(name);
    };
    fetchUserName();
  }, [userId]);

  const handleApprove = async () => {
    setLoading(true);
    const success = await approveCommunityRequest(requestId);
    if (success) {
      setStatus('approved');
      alert('Request approved successfully!');
    } else {
      alert('Failed to approve the request.');
    }
    setLoading(false);
  };

  const handleReject = () => {
    setShowRejectModal(true);
    setRejectionReason('');
  };

  const handleConfirmReject = async () => {
    setLoading(true);
    const success = await rejectCommunityRequest(requestId, rejectionReason);
    if (success) {
      setStatus('rejected');
      alert('Request rejected successfully!');
    } else {
      alert('Failed to reject the request.');
    }
    setShowRejectModal(false);
    setLoading(false);
  };

  const handleCancelReject = () => {
    setShowRejectModal(false);
    setRejectionReason('');
  };

  const isActionable = status === 'pending' && !loading;

  return (
    <>
      <div
        className="notification-card"
        style={{
          textAlign: 'left',
          padding: '1.5rem',
          backgroundColor: '#f9f9f9',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
          maxWidth: '600px',
          margin: '0 auto 1.5rem',
          transition: 'background-color 0.2s, box-shadow 0.2s',
          color: '#333',
          position: 'relative',
          opacity: status === 'pending' ? 1 : 0.8,
        }}
      >
        <strong>Community Name:</strong> {communityName} <br />
        <strong>Description:</strong> {communityDescription} <br />
        <strong>User:</strong> {userName} <br />
        <strong>Cause:</strong> {causeTitle}
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li>
            <span style={{ fontSize: '0.8em' }}> Description: {causeDescription}</span>
          </li>
          <li>
            <span style={{ fontSize: '0.8em' }}>
              End Date: {new Date(causeEndDate).toLocaleDateString()}{' '}
            </span>
          </li>
          <li>
            <span style={{ fontSize: '0.8em' }}>
              ODS:
              {causeOds && Array.isArray(causeOds)
                ? causeOds.map((ods) => ods.title).join(', ')
                : ''}
            </span>
          </li>
        </ul>
        <div
          className="action-buttons"
          style={{
            marginTop: '1rem',
            textAlign: 'center',
          }}
        >
          <button
            onClick={handleApprove}
            className="btn btn-success"
            style={{
              margin: '0 0.5rem',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              opacity: isActionable ? 1 : 0.5,
              cursor: isActionable ? 'pointer' : 'not-allowed',
            }}
            disabled={!isActionable}
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            className="btn btn-danger"
            style={{
              margin: '0 0.5rem',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              opacity: isActionable ? 1 : 0.5,
              cursor: isActionable ? 'pointer' : 'not-allowed',
            }}
            disabled={!isActionable}
          >
            Reject
          </button>
        </div>
        {status !== 'pending' && (
          <div
            style={{
              marginTop: '1rem',
              textAlign: 'center',
              color: status === 'approved' ? 'green' : 'red',
              fontWeight: 'bold',
            }}
          >
            {status === 'approved' ? 'Approved' : 'Rejected'}
          </div>
        )}
      </div>

      {/* Modal de rechazo */}
      <Modal show={showRejectModal} onHide={handleCancelReject} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reject Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="rejectionReason">
            <Form.Label>Reason for rejection</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Specify the reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelReject} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmReject}
            disabled={!rejectionReason.trim() || loading}
          >
            Confirm rejection
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
