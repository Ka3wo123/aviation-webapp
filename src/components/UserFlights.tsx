import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ListGroup, Container, Spinner, Alert, Row, Col } from 'react-bootstrap';
import '../styles/UserFlights.css';
import UserFlight from '../types/UserFlight';
import userService from '../services/UserService';

const UserFlights = () => {
    const { email } = useParams<{ email: string }>();
    const [flights, setFlights] = useState<UserFlight[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (email) {
            userService.getFlightsForUser(email).subscribe({
                next: (response: UserFlight[]) => {
                    setFlights(response);
                },
                error: (err: unknown) => console.error(err)
            });
            setLoading(false);
        }
    }, [email]);

    return (
        <Container className="user-flights-container mt-4">
            <h2 className="mb-4">Your Flights</h2>

            {loading && <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>}
            
            {!loading && flights.length === 0 && (
                <Alert variant="info">No flights found for your account.</Alert>
            )}

            {!loading && flights.length > 0 && (
                <ListGroup as="ol" numbered>
                    {flights.map((flight) => (
                        <ListGroup.Item
                            key={flight.id}
                            as="li"
                            className=" mb-3"
                        >
                            <div className="ms-2 me-auto">
                                <div><strong>Airline:</strong> {flight.airline}</div>
                                <Row>
                                    <Col>
                                        <strong>Origin:</strong> {flight.departureAirport}
                                    </Col>
                                    <Col>
                                        <strong>Destination:</strong> {flight.arrivalAirport}
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col>
                                        <strong>Departure Date:</strong> {new Date(flight.flightDate).toLocaleString()}
                                    </Col>
                                </Row>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
};

export default UserFlights;
