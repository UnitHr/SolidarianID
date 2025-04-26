import { Col, Row, Container, Alert, ListGroup, Pagination } from 'react-bootstrap';
import { FormFilterCauses } from '../components/FormFilterCauses';
import { useEffect, useState } from 'react';
import { CauseCard } from '../components/CauseCard';

export interface CauseValues {
  id: string;
  title: string;
  description: string;
  ods: OdsValues[];
  endDate: Date;
  communityId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OdsValues {
  id: number;
  title: string;
  description: string;
}

export function SearchCauses() {
  const urlBase = 'http://localhost:3000/api/v1/causes';
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [name, setName] = useState('');
  const [ods, setOds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [search, setSearch] = useState(false);
  const limit = 4;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [causes, setCauses] = useState<CauseValues[]>([]);

  useEffect(() => {
    fetchCauses();
  }, [page]);

  function changeName(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function changeOds(event: React.ChangeEvent<HTMLInputElement>) {
    const { id, checked } = event.target;
    const odsNumber = id.replace('ods', '');

    setOds((prev) => (checked ? [...prev, odsNumber] : prev.filter((n) => n !== odsNumber)));
  }

  function changeSortBy(event: React.ChangeEvent<HTMLSelectElement>) {
    setSortBy(event.target.value);
  }

  function changeSortDirection(event: React.ChangeEvent<HTMLSelectElement>) {
    setSortDirection(event.target.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    fetchCauses();
  }

  async function fetchCauses() {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (name !== '') {
      params.append('name', name);
    }

    if (ods.length > 0) {
      params.append('ods', ods.join(','));
    }

    params.append('sortBy', sortBy);
    params.append('sortDirection', sortDirection);

    const url = `${urlBase}?${params.toString()}`;

    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setTotalPages(data.meta.totalPages);
      setCauses(data.data);
      setSearch(true);

      setAlertMessage('Causes filtered successfully!');
      setAlertVariant('success');
      setShowAlert(true);
    } else {
      setAlertMessage('Backend error. Try again later.');
      setAlertVariant('danger');
      setShowAlert(true);
    }
  }

  return (
    <>
      {showAlert && (
        <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      )}
      <Container>
        <Row className="my-5">
          <h1 className="text-center">Filter Causes</h1>
        </Row>
        <Row className="my-4">
          <h3 className="px-4 py-4 text-justify">
            Discover and contribute to various communities and charitable causes Whether you're
            looking to support or to take action, get involved today!
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
        <Row className="my-4">
          <Container>
            <Row>
              {search && (
                <>
                  <h3>Results: </h3>
                </>
              )}
            </Row>
            {search && (
              <>
                <Row>
                  <ListGroup className="my-2">
                    {causes.length > 0 ? (
                      <>
                        <ListGroup.Item variant="secondary">
                          <Row className="d-flex flex-wrap gap-4 justify-content-center">
                            {causes.map((cause) => (
                              <CauseCard
                                key={cause.id}
                                id={cause.id}
                                title={cause.title}
                                description={cause.description}
                                ods={cause.ods}
                                endDate={cause.endDate}
                                communityId={cause.communityId}
                                createdBy={cause.createdBy}
                                createdAt={cause.createdAt}
                                updatedAt={cause.updatedAt}
                              />
                            ))}
                          </Row>
                        </ListGroup.Item>
                        <Pagination className="mt-3">
                          <Pagination.First
                            onClick={() => {
                              setPage(1);
                            }}
                          />
                          <Pagination.Prev
                            onClick={() => {
                              setPage(page > 1 ? page - 1 : page);
                            }}
                          />
                          <Pagination.Item>{page}</Pagination.Item>
                          <Pagination.Next
                            onClick={() => {
                              setPage(page < totalPages ? page + 1 : page);
                            }}
                          />
                          <Pagination.Last
                            onClick={() => {
                              setPage(totalPages);
                            }}
                          />
                        </Pagination>
                      </>
                    ) : (
                      <ListGroup.Item>No results found</ListGroup.Item>
                    )}
                  </ListGroup>
                </Row>
              </>
            )}
          </Container>
        </Row>
      </Container>
    </>
  );
}
