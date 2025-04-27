import React, { useState, useEffect } from 'react';
import { markNotificationAsRead } from '../services/notificacion.service';
import { AiFillSound, AiFillEye } from 'react-icons/ai';
import { ModalValidateJoinCommunity } from './ModalValidateJoinCommunity';
import { fetchJoinRequestById } from '../services/community.service';

interface NotificationProps {
  notificationId: string;
  userName: string;
  message: string;
  date: string;
  userId: string;
  read: boolean;
  entityId: string;
  type: 'user' | 'creationRequest' | 'joinRequest';
}

interface JoinRequestData {
  id: string;
  userId: string;
  communityName: string;
  communityId: string;
  status: string;
}

export const NotificationCard: React.FC<NotificationProps> = ({
  notificationId,
  userName,
  message,
  date,
  userId,
  entityId,
  read: initialRead,
  type,
}) => {
  const [read, setRead] = useState(initialRead);
  const [showModal, setShowModal] = useState(false);
  const [joinRequestData, setJoinRequestData] = useState<JoinRequestData | null>(null);
  const [isPending, setIsPending] = useState(false); // Estado de la solicitud (pendiente o no)
  const [eyeHovered, setEyeHovered] = useState(false);

  useEffect(() => {
    if (type === 'joinRequest') {
      fetchJoinRequestStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, entityId, userId]);

  const markAsRead = async () => {
    if (!read) {
      try {
        await markNotificationAsRead(notificationId);
        setRead(true);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  };

  const fetchJoinRequestStatus = async () => {
    try {
      const data = await fetchJoinRequestById(userId, entityId);
      setJoinRequestData(data);
      setIsPending(data.status === 'pending');
    } catch (error) {
      console.error('Failed to fetch join request:', error);
    }
  };

  const handleViewDetails = async () => {
    await fetchJoinRequestStatus();
    setShowModal(true);
  };

  const handleHoverEye = async () => {
    await markAsRead();
  };

  const handleLeaveEye = () => {
    if (!read) {
      setEyeHovered(false);
    }
  };

  const handleMouseEnterEye = async () => {
    if (!read) {
      await handleHoverEye();
    }
    setEyeHovered(true);
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  const changeAlertMessage = (value: string) => {
    console.log('Alert Message:', value);
  };

  const changeAlertVariant = (value: string) => {
    console.log('Alert Variant:', value);
  };

  const handleAlertShow = () => {
    console.log('Show Alert');
  };

  return (
    <>
      <div
        className="notification-card"
        style={{
          textAlign: 'left',
          padding: '1.5rem',
          backgroundColor: isPending ? '#f9f9f9' : read ? '#ffffff' : '#f9f9f9',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          boxShadow: read ? '0 1px 4px rgba(0, 0, 0, 0.03)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
          maxWidth: '600px',
          margin: '0 auto 1.5rem',
          transition: 'background-color 0.2s, box-shadow 0.2s',
          color: read ? '#999' : '#333',
          position: 'relative',
        }}
      >
        <div style={{ marginBottom: '1rem', fontWeight: read ? 'normal' : 'bold' }}>
          <AiFillSound /> <strong>User:</strong> {userName}
        </div>
        <div style={{ marginBottom: '1rem' }}>{message}</div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.9rem',
          }}
        >
          <div>
            <strong>Date:</strong> {date}
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {type === 'joinRequest' ? (
              <button
                onClick={handleViewDetails}
                style={{
                  marginLeft: '1rem',
                  backgroundColor: isPending ? '#007bff' : '#007bff80', // Botón claro si no está pendiente
                  color: '#fff',
                  border: 'none',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  cursor: isPending ? 'pointer' : 'not-allowed', // Deshabilitar cursor si no está pendiente
                  fontSize: '0.85rem',
                  opacity: isPending ? 1 : 0.5, // Baja la opacidad cuando no está pendiente
                  pointerEvents: isPending ? 'auto' : 'none', // No permite hacer click si no está pendiente
                }}
              >
                View Details
              </button>
            ) : (
              <div
                onMouseEnter={handleMouseEnterEye}
                onMouseLeave={handleLeaveEye}
                style={{
                  marginLeft: '1rem',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  color: eyeHovered || read ? '#66b2ff' : '#007bff',
                  transition: 'color 0.3s',
                }}
              >
                <AiFillEye />
              </div>
            )}
          </div>
        </div>
      </div>

      {joinRequestData && type === 'joinRequest' && (
        <ModalValidateJoinCommunity
          userId={joinRequestData.userId}
          communityName={joinRequestData.communityName}
          communityId={joinRequestData.communityId}
          joinRequestId={joinRequestData.id}
          show={showModal}
          changeAlertMessage={changeAlertMessage}
          changeAlertVariant={changeAlertVariant}
          handleAlertShow={handleAlertShow}
          handleHide={handleHideModal}
        />
      )}
    </>
  );
};
