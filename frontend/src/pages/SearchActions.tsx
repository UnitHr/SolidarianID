import { Col, Container, Row, Image, ListGroup, Pagination, Alert } from 'react-bootstrap';
import { SolidarianNavbar } from '../components/SolidarianNavbar';
import image from '../assets/filter-actions-image.png';
import { FormFilterActions } from '../components/FormFilterActions';
import { useEffect, useState } from 'react';
import { ActionCard } from '../components/ActionCard';

export interface ActionValues {
  id: string;
  status: string;
  type: string;
  title: string;
  description: string;
  causeId: string;
  target: number;
  unit: string;
  achieved: number;
  goodType?: string;
  location?: string;
  date?: Date;
}

export function SearchActions() {
  const urlBase = 'http://localhost:3000/api/v1/actions';
  const [name, setName] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [status, setStatus] = useState('COMPLETED');
  const [search, setSearch] = useState(false);
  const limit = 4;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [actions, setActions] = useState<ActionValues[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  useEffect(() => {
    fetchActions();
  }, [page]);

  function changeName(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function changeStatus(event: React.ChangeEvent<HTMLInputElement>) {
    setStatus(event.target.value);
  }

  function changeSortBy(event: React.ChangeEvent<HTMLSelectElement>) {
    setSortBy(event.target.value);
  }

  function changeSortDirection(event: React.ChangeEvent<HTMLSelectElement>) {
    setSortDirection(event.target.value);
  }

  async function handleSearch(e) {
    e.preventDefault();
    fetchActions();
  }

  async function fetchActions() {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (name !== '') {
      params.append('name', name);
    }

    params.append('sortBy', sortBy);
    params.append('sortDirection', sortDirection);
    params.append('status', status);

    const url = `${urlBase}?${params.toString()}`;
    alert(url);

    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setTotalPages(data.meta.totalPages);
      setActions(data.data);
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
      <SolidarianNavbar></SolidarianNavbar>
      {showAlert && (
        <Alert variant={alertVariant} onClose={(e) => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      )}
      <Container>
        <Row className="my-5">
          <h1 className="text-center">Search Actions</h1>
        </Row>
        <Row className="my-4">
          <h3 className="px-4 py-4 text-justify">
            Find meaningful actions you can contribute to. Use the search tool to explore
            initiatives aligned with your interests and help communities reach their goals.
          </h3>

          <h4 className="px-4 py-4 text-justify">
            Whether it's volunteering, donating, or spreading awareness — every action counts toward
            creating positive change.
          </h4>
        </Row>
        <Row>
          <Col sm={6} md={6} lg={6}>
            <Image src={image} fluid />
          </Col>
          <Col>
            <FormFilterActions
              name={name}
              sortBy={sortBy}
              sortDireciton={sortDirection}
              status={status}
              changeName={changeName}
              changeSortBy={changeSortBy}
              changeSortDirection={changeSortDirection}
              changeStatus={changeStatus}
              handleSearch={handleSearch}
            ></FormFilterActions>
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
                    {actions.length > 0 ? (
                      <>
                        <ListGroup.Item variant="secondary">
                          <Row className="d-flex flex-wrap gap-4 justify-content-center">
                            {actions.map((action) => (
                              <ActionCard
                                key={action.id}
                                id={action.id}
                                status={action.status}
                                type={action.type}
                                title={action.title}
                                description={action.description}
                                causeId={action.causeId}
                                target={action.target}
                                unit={action.unit}
                                achieved={action.achieved}
                                location={action.location}
                                date={action.date}
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
