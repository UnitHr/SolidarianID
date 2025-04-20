import { Col, Container, Row } from "react-bootstrap";
import { SolidarianNavbar } from "../components/SolidarianNavbar";
import { useState } from "react";
import { odsData, ODSEnum } from "../utils/ods";

export function CreateCommunityRequest() {
  const [selectedOds, setSelectedOds] = useState<Set<ODSEnum>>(new Set());

  const handleCheckboxChange = (id: ODSEnum) => {
    setSelectedOds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id); // Deseleccionar
      } else {
        newSet.add(id); // Seleccionar
      }
      return newSet;
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const communityName = (
      document.getElementById("communityName") as HTMLInputElement
    ).value;
    const communityDescription = (
      document.getElementById("communityDescription") as HTMLTextAreaElement
    ).value;
    const causeTitle = (
      document.getElementById("causeTitle") as HTMLInputElement
    ).value;
    const causeDescription = (
      document.getElementById("causeDescription") as HTMLTextAreaElement
    ).value;
    const causeEndDate = (
      document.getElementById("causeEndDate") as HTMLInputElement
    ).value;
    const selectedIds = Array.from(selectedOds); // Convertir el Set a Array

    // Construir el cuerpo de la solicitud
    const requestBody = {
      name: communityName,
      description: communityDescription,
      cause: {
        title: causeTitle,
        description: causeDescription,
        end: causeEndDate,
        ods: selectedIds,
      },
    };

    console.log("Request Body:", requestBody); // Para depuración

    try {
      // Enviar la solicitud al servidor
      const response = await fetch("http://localhost:3002/communities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Reemplaza con tu método para obtener el token
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      console.log("Community Request created successfully:", data);

      alert("Community Request created successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create community request. Please try again.");
    }
  };

  return (
    <>
      <SolidarianNavbar></SolidarianNavbar>
      <Container>
        <Row>
          <Row className="my-5">
            <h1 className="text-center">Request a new community creation</h1>
          </Row>

          <Row className="my-4">
            <Col md={{ span: 6, offset: 3 }}>
              <form>
                <div className="mb-3">
                  <label htmlFor="communityName" className="form-label">
                    Community Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="communityName"
                    placeholder="Enter community name"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="communityDescription" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="communityDescription"
                    placeholder="Enter community description"
                    rows={3}
                  ></textarea>
                </div>

                <Row className="my-4">
                  <div className="mb-3">
                    <label htmlFor="causeForm" className="form-label">
                      Cause
                    </label>
                    <div className="mb-3">
                      <label htmlFor="causeTitle" className="form-label">
                        Cause Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="causeTitle"
                        placeholder="Enter cause title"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="causeDescription" className="form-label">
                        Cause Description
                      </label>
                      <textarea
                        className="form-control"
                        id="causeDescription"
                        placeholder="Enter cause description"
                        rows={3}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="causeEndDate" className="form-label">
                        End Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="causeEndDate"
                        min={new Date().toISOString().split("T")[0]} // Set minimum date to today
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="causeOds" className="form-label">
                        ODS (Select at least one)
                      </label>
                      <div id="causeOds"></div>
                      {Object.values(odsData).map((ods) => (
                        <div className="form-check" key={ods.id}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`ods${ods.id}`}
                            value={ods.id}
                            onChange={() => handleCheckboxChange(ods.id)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`ods${ods.id}`}
                          >
                            {ods.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </Row>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </form>
            </Col>
          </Row>
        </Row>
      </Container>
    </>
  );
}
