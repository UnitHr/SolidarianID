import { Alert, Button, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import { SolidarianNavbar } from "../components/SolidarianNavbar";
import { useEffect, useState } from "react";
import "../index.css";
import { ModalValidateJoinCommunity } from "../components/ModalValidateJoinCommunity";

interface JoinComunityRequestValues{
  id: string;
  userId: string;
  communityId: string;
  communityName: string;
  status: string;
  comment: string;
}

export function Notifications() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCommunityAdmin, setIsCommunityAdmin] = useState(false);
  const [managedCommunities, setManagedCommunities] = useState<string[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinComunityRequestValues[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCommunity, setCurrentCommunity] = useState("");
  const pageSize = 5;

  function changeAlertMessage(value: string) {
    setAlertMessage(value);
  }

  function changeAlertVariant(value: string) {
    setAlertVariant(value);
  }


  async function fetchJoinRequests(){
    const response = await fetch(`http://localhost:3000/api/v1/communities/${currentCommunity}/join-requests`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if(response.ok){
      const data = await response.json();
      setJoinRequests(data.data);
    }
    else{
      setAlertMessage("Error fetching join requests for community " + currentCommunity);
      setAlertVariant("danger");
      setShowAlert(true);
    } 
  }

  function handleCommunityChange(event) {
    setCurrentCommunity(event.target.value);
  }

  // Fetch user role and pending requests
  useEffect(() => {
    const fetchUserRoleAndRequests = async () => {
      try {
        // Get user role from localStorage
        const userRoles = JSON.parse(localStorage.getItem('user') || '{}').roles || [];
        const isAdminRole = userRoles.includes('admin');
        setIsAdmin(isAdminRole);

        // Fetch pending requests if user is admin
        if (isAdminRole) {
          const requestsResponse = await fetch(
            'http://localhost:3002/communities/creation-requests?status=pending',
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
          if (!requestsResponse.ok) {
            throw new Error('Failed to fetch pending requests');
          }
          const requestsData = await requestsResponse.json();
          console.log(requestsData);
          setPendingRequests(requestsData.data);
        }
        else{
          // Check if user is community admin
          const response = await fetch('http://localhost:3000/api/v1/communities/managed-communities', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          const data = await response.json();
          if(data.data.length > 0) {
            setIsCommunityAdmin(true);
            setManagedCommunities(data.data);
            setCurrentCommunity(data.data[0]);
          }

        }

      } catch (error) {
        console.error(error);
      }
    };

    fetchUserRoleAndRequests();
  }, []);

  // Calculate paginated data
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRequests = pendingRequests.slice(startIndex, startIndex + pageSize);

  // Handle pagination
  const totalPages = Math.ceil(pendingRequests.length / pageSize);
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <SolidarianNavbar></SolidarianNavbar>
      {showAlert && (
        <Alert
          variant={alertVariant}
          onClose={(e) => setShowAlert(false)}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}
      <Container>
        <ModalValidateJoinCommunity
          show={showModal}
          communityName="Amigos por África"
          userName="pepe martinez"
          userId="1234"
          communityId="1234"
          changeAlertMessage={changeAlertMessage}
          changeAlertVariant={changeAlertVariant}
          handleAlertShow={() => setShowAlert(true)}
          joinRequestId="1234"
          handleHide={() => setShowModal(false)}
        ></ModalValidateJoinCommunity>
        <Row>
          <Row className="my-5">
            <h1 className="text-center">Notifications</h1>
          </Row>
          {isAdmin && (
            <Row className="my-5">
              <h2>Solicitudes de creación de comunidad pendientes</h2>
              {pendingRequests.length > 0 ? (
                <>
                  <div className="panel">
                    {paginatedRequests.map((request) => (
                      <div key={request.id} className="request-card">
                        <strong>Nombre de la comunidad:</strong> {request.communityName} <br />
                        <strong>Descripción de la comunidad:</strong> {request.communityDescription}{' '}
                        <br />
                        <strong>Usuario ID:</strong> {request.userId} <br />
                        <strong>Causa:</strong>
                        <ul>
                          <li>
                            <strong>Título:</strong> {request.causeTitle}
                          </li>
                          <li>
                            <strong>Descripción:</strong> {request.causeDescription}
                          </li>
                          <li>
                            <strong>Fecha Fin:</strong>{' '}
                            {new Date(request.causeEndDate).toLocaleDateString()}
                          </li>
                          <li>
                            <strong>ODS:</strong>{' '}
                            {request.causeOds.map((ods: { title: any }) => ods.title).join(', ')}
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="pagination-controls">
                    <Button
                      variant="primary"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <span className="mx-3">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="primary"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </>
              ) : (
                <p>No hay solicitudes pendientes.</p>
              )}
            </Row>
          )}

          {isCommunityAdmin && (
            <Row className="my-5">
              <h2>Solicitudes de unión a comunidades pendientes</h2>
              <Form.Select value={currentCommunity} onChange={handleCommunityChange}>
                <option value="">Select a community</option>
                {managedCommunities.map((community) => (
                  <option key={community} value={community}>
                    {community}
                  </option>
                ))}
              </Form.Select>
              <ListGroup>
                {joinRequests.length > 0 ? (
                  joinRequests.map((request) => (
                    <ListGroup.Item key={request.id}>
                      <strong>Community name:</strong> {request.communityName} <br />
                      <strong>User ID:</strong> {request.userId} <br />
                      <Button
                        variant="primary"
                        onClick={() => {
                          setShowModal(true);}}
                      >
                        Validate
                      </Button>
                    </ListGroup.Item>
                  ))
                ) : (
                  <p>No hay solicitudes pendientes.</p>
                )}
               </ListGroup>
            </Row>
          )}
        </Row>
      </Container>
    </>
  );
}
