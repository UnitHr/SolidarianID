import React from 'react';

interface CreateCommunityRequestCardProps {
  communityName: string;
  communityDescription: string;
  userId: string;
  causeTitle: string;
  causeDescription: string;
  causeEndDate: string;
  causeOds: { title: string }[];
  onApprove: () => void;
  onReject: () => void;
}

export const CreateCommunityRequestCard: React.FC<CreateCommunityRequestCardProps> = ({
  communityName,
  communityDescription,
  userId,
  causeTitle,
  causeDescription,
  causeEndDate,
  causeOds,
  onApprove,
  onReject,
}) => {
  return (
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
      }}
    >
      <strong>Community Name:</strong> {communityName} <br />
      <strong>Community Description:</strong> {communityDescription} <br />
      <strong>User ID:</strong> {userId} <br />
      <strong>Cause:</strong>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li>
          <strong>Title:</strong> {causeTitle}
        </li>
        <li>
          <strong>Description:</strong> {causeDescription}
        </li>
        <li>
          <strong>End Date:</strong> {new Date(causeEndDate).toLocaleDateString()}
        </li>
        <li>
          <strong>ODS:</strong> {causeOds.map((ods) => ods.title).join(', ')}
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
          onClick={onApprove}
          className="btn btn-success"
          style={{ margin: '0 0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
        >
          Approve
        </button>
        <button
          onClick={onReject}
          className="btn btn-danger"
          style={{ margin: '0 0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}
        >
          Reject
        </button>
      </div>
    </div>
  );
};
