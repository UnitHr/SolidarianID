import { Button, Container, Row } from "react-bootstrap";
import { SolidarianNavbar } from "../components/SolidarianNavbar";
import { useEffect, useState } from "react";
import "../index.css";

export function Notifications() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Fetch user role and pending requests
  useEffect(() => {
    const fetchUserRoleAndRequests = async () => {
      try {
        // Get user role from localStorage
        const userRoles =
          JSON.parse(localStorage.getItem("user") || "{}").roles || [];
        const isAdminRole = userRoles.includes("admin");
        setIsAdmin(isAdminRole);

        // Fetch pending requests if user is admin
        if (isAdminRole) {
          const requestsResponse = await fetch(
            "http://localhost:3002/communities/creation-requests?status=pending",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (!requestsResponse.ok) {
            throw new Error("Failed to fetch pending requests");
          }
          const requestsData = await requestsResponse.json();
          console.log(requestsData);
          setPendingRequests(requestsData.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserRoleAndRequests();
  }, []);

  // Calculate paginated data
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRequests = pendingRequests.slice(
    startIndex,
    startIndex + pageSize
  );

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
      <Container>
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
                        <strong>Nombre de la comunidad:</strong>{" "}
                        {request.communityName} <br />
                        <strong>Descripción de la comunidad:</strong>{" "}
                        {request.communityDescription} <br />
                        <strong>Usuario ID:</strong> {request.userId} <br />
                        <strong>Causa:</strong>
                        <ul>
                          <li>
                            <strong>Título:</strong> {request.causeTitle}
                          </li>
                          <li>
                            <strong>Descripción:</strong>{" "}
                            {request.causeDescription}
                          </li>
                          <li>
                            <strong>Fecha Fin:</strong>{" "}
                            {new Date(
                              request.causeEndDate
                            ).toLocaleDateString()}
                          </li>
                          <li>
                            <strong>ODS:</strong>{" "}
                            {request.causeOds
                              .map((ods: { title: any }) => ods.title)
                              .join(", ")}
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
        </Row>
      </Container>
    </>
  );
}
