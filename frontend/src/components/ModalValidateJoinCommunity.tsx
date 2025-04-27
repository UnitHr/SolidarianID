import { useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { approveJoinRequest, rejectJoinRequest } from '../services/community.service';

interface ComponentProps {
  userId: string;
  communityName: string;
  communityId: string;
  joinRequestId: string;
  show: boolean;
  changeAlertMessage: (value: string) => void;
  changeAlertVariant: (value: string) => void;
  handleAlertShow: () => void;
  handleHide: () => void;
}

export function ModalValidateJoinCommunity(props: ComponentProps) {
  const [showCommentEntry, setShowCommentEntry] = useState(false);
  const [comment, setComment] = useState('');
  const [countReject, setCountReject] = useState(0);

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setComment(event.target.value);

  // Función para manejar la aceptación de la solicitud
  const handleAccept = async () => {
    try {
      const response = await approveJoinRequest(props.communityId, props.joinRequestId);
      if (response) {
        props.changeAlertMessage('Join request accepted');
        props.changeAlertVariant('success');
      } else {
        props.changeAlertMessage('Error accepting the join request');
        props.changeAlertVariant('danger');
      }
    } catch (error) {
      props.changeAlertMessage(`Error: ${error}`);
      props.changeAlertVariant('danger');
    } finally {
      props.handleAlertShow();
      props.handleHide();
    }
  };

  // Función para manejar el rechazo de la solicitud
  const handleReject = async () => {
    if (countReject === 0) {
      setShowCommentEntry(true);
      setCountReject(1);
      return;
    }

    if (!comment.trim()) {
      props.changeAlertMessage('You must enter a comment to reject the join request.');
      props.changeAlertVariant('danger');
      props.handleAlertShow();
      return;
    }

    try {
      const response = await rejectJoinRequest(props.communityId, props.joinRequestId, comment);
      if (response) {
        props.changeAlertMessage('Join request rejected');
        props.changeAlertVariant('success');
      } else {
        props.changeAlertMessage('Error rejecting the join request');
        props.changeAlertVariant('danger');
      }
    } catch (error) {
      props.changeAlertMessage(`Error: ${error}`);
      props.changeAlertVariant('danger');
    } finally {
      setShowCommentEntry(false);
      setCountReject(0);
      props.handleAlertShow();
      props.handleHide();
    }
  };

  const handleSeeUserHistory = () => {
    window.location.href = `/profile/${props.userId}`;
  };

  return (
    <Modal show={props.show} onHide={props.handleHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          Join request to the community <b>{props.communityName}</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <h5>
              The user with ID <b>{props.userId}</b> has requested to join the community{' '}
              <b>{props.communityName}</b>.
            </h5>
          </Row>
          <Row className="mt-3">
            <Col></Col>
            <Col sm={6} md={6} lg={6}>
              <Button variant="info" onClick={handleSeeUserHistory}>
                See user history
              </Button>
            </Col>
            <Col></Col>
          </Row>

          {showCommentEntry && (
            <>
              <Form.Label>Comment</Form.Label>
              <Form.Control
                id="inputComment"
                aria-describedby="commentHelpBlock"
                value={comment}
                onChange={handleCommentChange}
              />
              <Form.Text id="commentHelpBlock" muted>
                You must enter a comment to reject the join request.
              </Form.Text>
            </>
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleAccept}>
          Accept
        </Button>
        <Button variant="danger" onClick={handleReject}>
          Reject
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
