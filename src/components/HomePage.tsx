import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import airportMap from '../assets/images/airports_map.png';
import airlines from '../assets/images/airlines.jpg';
import ticket from '../assets/images/airline-tickets.webp';
import '../styles/HomePage.css';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div>
            <div className="bg-secondary text-center py-5 mb-4">
                <Container>
                    <h1 className="display-4">Aviation Explorer</h1>
                    <p className="lead">Discover the world's airlines, airports, and flights with ease.</p>
                </Container>
            </div>

            <Container>
                <Row>
                    <Col md={4} className="mb-4">
                        <Card>
                            <Card.Img variant="top" src={airlines} alt="Airlines" className="card-img-top" />
                            <Card.Body>
                                <Card.Title>Airlines</Card.Title>
                                <Card.Text>
                                    Get familiar with airlines You want to fly.
                                </Card.Text>
                                <Button variant="outline-primary">
                                    <Link to={"/airlines"} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        Search airlines
                                    </Link>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4} className="mb-4">
                        <Card>
                            <Card.Img variant="top" src={airportMap} alt="Airports" className="card-img-top" />
                            <Card.Body>
                                <Card.Title>Airports map</Card.Title>
                                <Card.Text>
                                    Find airports on the entire world.
                                </Card.Text>
                                <Button variant="outline-primary">
                                    <Link to={"/airports/map"} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        Find airports
                                    </Link>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card>
                            <Card.Img variant="top" src={ticket} alt="Flights" className="card-img-top" />
                            <Card.Body>
                                <Card.Title>Flights</Card.Title>
                                <Card.Text>
                                    Find Your flight to destination.
                                </Card.Text>
                                <Button variant="outline-primary">
                                    <Link to={"/flight/search"} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        Search flights
                                    </Link>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default HomePage;
