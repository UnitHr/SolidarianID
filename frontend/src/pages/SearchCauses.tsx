import { Col, Row, Image, Container, Alert } from "react-bootstrap";
import { SolidarianNavbar } from "../components/SolidarianNavbar";
import { FormFilterCauses } from "../components/FormFilterCauses";
import image from "../assets/filter-causes-image.png";
import { useState } from "react";

export function SearchCauses() {
  const urlBase = "http://localhost:8080/api/causes";
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [name, setName] = useState("");
  const [ods, setOds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  function changeName(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function changeOds(event: React.ChangeEvent<HTMLInputElement>) {
    const { id, checked } = event.target;
    const odsNumber = id.replace("ods", "");

    setOds((prev) =>
      checked ? [...prev, odsNumber] : prev.filter((n) => n !== odsNumber)
    );
  }

  function changeSortBy(event: React.ChangeEvent<HTMLSelectElement>) {
    setSortBy(event.target.value);
  }

  function changeSortDirection(event: React.ChangeEvent<HTMLSelectElement>) {
    setSortDirection(event.target.value);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setShowAlert(true);
    setAlertMessage("Causes filtered successfully!");
    setAlertVariant("success");

    /*
    event.preventDefault();
    const queryParams = {
      name,
      ods: ods.join(","),
      sortBy,
      sortDirection,
    };
    const urlWithQueryParams =
      urlBase + "?" + new URLSearchParams(queryParams).toString();

    const response = await fetch(urlWithQueryParams);
    if (response.ok) {
      const data = await response.json();
      setShowAlert(true);
      setAlertMessage("Causes filtered successfully!");
      setAlertVariant("success");
    } else {
      setShowAlert(true);
      setAlertMessage("Error filtering causes");
      setAlertVariant("danger");
    }*/
  }

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
        <Row className="my-5">
          <h1 className="text-center">Filter Causes</h1>
        </Row>
        <Row className="my-4">
          <h3 className="px-4 py-4 text-justify">
            Discover and contribute to various communities and charitable causes
            Whether you're looking to support or to take action, get involved
            today!
          </h3>
        </Row>
        <Row>
          <Col>
            <Row className="mt-5">
              <FormFilterCauses
                name={name}
                ods={ods}
                sortBy={sortBy}
                sortDirection={sortDirection}
                changeName={changeName}
                changeOds={changeOds}
                changeSortBy={changeSortBy}
                changeSortDirection={changeSortDirection}
                handleSubmit={handleSubmit}
              ></FormFilterCauses>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}
