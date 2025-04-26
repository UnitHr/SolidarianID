import { useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';

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
  const urlBase = `https://localhost:3000/api/v1/communities/${props.communityId}/join-requests/${props.joinRequestId}`;
  const [showCommentEntry, setShowCommentEntry] = useState(false);
  const [countReject, setCountReject] = useState(0);
  const [comment, setComment] = useState('');

  function changeComment(event: React.ChangeEvent<HTMLInputElement>) {
    setComment(event.target.value);
  }

  async function sendJoinRequestUpdate(status: string, comment?: string) {
    const body: any = { status };
    if (comment) {
      body.comment = comment;
    }

    const response = await fetch(urlBase, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return response;
  }

  async function handleAccept() {
    try {
      const response = await sendJoinRequestUpdate('approved');

      if (response.status === 201) {
        props.changeAlertMessage('Join request accepted');
        props.changeAlertVariant('success');
      } else {
        const data = await response.json();
        props.changeAlertMessage('Error: ' + (data.errors?.message || 'Unknown error'));
        props.changeAlertVariant('danger');
      }
    } catch (error) {
      props.changeAlertMessage('Error: ' + (error as Error).message);
      props.changeAlertVariant('danger');
    } finally {
      props.handleAlertShow();
      props.handleHide();
    }
  }

  async function handleReject() {
    if (countReject === 0) {
      setShowCommentEntry(true);
      setCountReject(1);
      return;
    }

    if (comment.trim() === '') {
      props.changeAlertMessage('You must enter a comment to reject the join request.');
      props.changeAlertVariant('danger');
      props.handleAlertShow();
      return;
    }

    try {
      const response = await sendJoinRequestUpdate('rejected', comment);

      if (response.status === 201) {
        props.changeAlertMessage('Join request rejected');
        props.changeAlertVariant('success');
      } else {
        const data = await response.json();
        props.changeAlertMessage('Error: ' + (data.errors?.message || 'Unknown error'));
        props.changeAlertVariant('danger');
      }
    } catch (error) {
      props.changeAlertMessage('Error: ' + (error as Error).message);
      props.changeAlertVariant('danger');
    } finally {
      setShowCommentEntry(false);
      setCountReject(0);
      props.handleAlertShow();
      props.handleHide();
    }
  }

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
              <Button variant="info">See user history</Button>
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
                onChange={changeComment}
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
