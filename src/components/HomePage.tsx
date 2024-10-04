import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import airportMap from '../assets/images/airports_map.png';
import airports from '../assets/images/airport.jpg';
import airlines from '../assets/images/airlines.jpg';
import flights from '../assets/images/flights.jpg';
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
                                <Button variant="outline-primary">Learn More</Button>
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
                            <Card.Img variant="top" src={flights} alt="Flights" className="card-img-top" />
                            <Card.Body>
                                <Card.Title>Flights</Card.Title>
                                <Card.Text>
                                    Track real-time flight information.
                                </Card.Text>
                                <Button variant="outline-primary">Track Flights</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md={4} className="mb-4">
                        <Card>
                            <Card.Img variant="top" src={airlines} alt="Airlines" className="card-img-top" />
                            <Card.Body>
                                <Card.Title>Airlines</Card.Title>
                                <Card.Text>
                                    Get familiar with airlines You want to fly.
                                </Card.Text>
                                <Button variant="outline-primary">Learn More</Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4} className="mb-4">
                        <Card>
                            <Card.Img variant="top" src={airports} alt="Airports" className="card-img-top" />
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
                                <Card.Title>Tickets</Card.Title>
                                <Card.Text>
                                    Find Your flight to destination.
                                </Card.Text>
                                <Button variant="outline-primary">Book flight</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

            </Container>

            <footer className="bg-dark text-light py-3 text-center">
                <Container>
                    <p>&copy; 2024 Aviation Explorer. All Rights Reserved.</p>
                </Container>
            </footer>
        </div>
    );
};

export default HomePage;
