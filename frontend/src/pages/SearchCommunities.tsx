import { Col, Container, Row, Image, ListGroup, Pagination, Alert } from 'react-bootstrap';
import { FormFilterCommunities } from '../components/FormFilterCommunities';
import { CommunityCard } from '../components/CommunityCard';
import image from '../assets/filter-communities-image-2.png';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface CommunityValues {
  id: string;
  adminId: string;
  name: string;
  description: string;
}

export function SearchCommunities() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const urlBase = 'http://localhost:3000/api/v1/communities';
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [search, setSearch] = useState(false);
  const limit = 4;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [communities, setCommunities] = useState<CommunityValues[]>([]);

  useEffect(() => {
    fetchCommunities();
  }, [page, name]);

  function changeName(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function handleCreateCommunity() {
    navigate('/communities/request');
  }

  async function handleSearch(e) {
    e.preventDefault();
    fetchCommunities();
  }

  async function fetchCommunities() {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (name !== '') {
      params.append('name', name);
    }

    const url = `${urlBase}?${params.toString()}`;

    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setTotalPages(data.meta.totalPages);
      setCommunities(data.data);
      setSearch(true);

      setAlertMessage('Communities filtered successfully!');
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
        <Alert variant={alertVariant} onClose={(e) => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      )}
      <Container>
        <Row>
          <Row className="mt-5 mb-2">
            <h1 className="text-center">Search Communities</h1>
          </Row>
          <Row className="mb-5 text-center">
            <p>
              or create a new one:{' '}
              <button className="btn btn-primary mx-2" onClick={handleCreateCommunity}>
                Create Community
              </button>
            </p>
          </Row>
          <Row className="my-4">
            <h3 className="px-4 py-4 text-justify">
              Discover and contribute to various communities and charitable causes Whether you're
              looking to support or to take action, get involved today!
            </h3>
          </Row>
        </Row>
        <Row className="align-items-center">
          <Col>
            <Image src={image} className="rounded-pill" fluid />
          </Col>
          <Col className="d-flex justify-content-center align-items-center">
            <FormFilterCommunities
              name={name}
              changeName={changeName}
              handleSearch={handleSearch}
            ></FormFilterCommunities>
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
                    {communities.length > 0 ? (
                      <>
                        <ListGroup.Item variant="secondary">
                          <Row className="d-flex flex-wrap gap-4 justify-content-center">
                            {communities.map((community) => (
                              <CommunityCard
                                key={community.id}
                                id={community.id}
                                name={community.name}
                                description={community.description}
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
