import { Col, Row, Image, Container } from "react-bootstrap";
import { SolidarianNavbar } from "../components/SolidarianNavbar";
import { FormFilterCauses } from "../components/FormFilterCauses";
import image from "../assets/filter-causes-image.png";
import { useState } from "react";

export function SearchCauses() {
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    alert(
      `Name: ${name}, ODS: ${ods.join(
        ", "
      )}, Sort By: ${sortBy}, Sort Direction: ${sortDirection}`
    );
  }

  return (
    <>
      <SolidarianNavbar></SolidarianNavbar>
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
          <Col>
            <Image src={image} fluid />
          </Col>
        </Row>
      </Container>
    </>
  );
}
