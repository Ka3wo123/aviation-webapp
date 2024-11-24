import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Tab, Container, Alert, ListGroup, Row, Col, Button } from 'react-bootstrap';
import '../styles/UserFlights.css';
import UserFlight from '../types/UserFlight';
import userService from '../services/UserService';
import { toast } from 'react-toastify';
import airplaneIcon from '../assets/icons/airplane.png';

const UserFlights = () => {
    const { email } = useParams<{ email: string }>();
    const [flights, setFlights] = useState<UserFlight[]>([]);
    const [currentFlights, setCurrentFlights] = useState<UserFlight[]>([]);
    const [archivedFlights, setArchivedFlights] = useState<UserFlight[]>([]);
    const [key, setKey] = useState<string>('current');

    useEffect(() => {
        if (email) {
            userService.getFlightsForUser(email).subscribe({
                next: (response: UserFlight[]) => {
                    const today = new Date();
                    setFlights(response);
                    setCurrentFlights(response.filter(flight => new Date(flight.flightDate) >= today));
                    setArchivedFlights(response.filter(flight => new Date(flight.flightDate) < today));
                },
                error: (err: unknown) => console.error(err),
            });
        }
    }, [email]);

    const deleteFlight = (email: string | undefined, flightId: number) => {
        userService.deleteFlight(email, flightId).subscribe({
            next: () => {
                toast.success("Flight deleted successfully!");
                setFlights(flights.filter(flight => flight.id === flightId));
                setCurrentFlights(currentFlights.filter(flight => flight.id !== flightId));
                setArchivedFlights(archivedFlights.filter(flight => flight.id !== flightId));
            },
            error: (err: unknown) => {
                console.error(err);
                toast.error("Failed to delete flight.");
            },
        });
    };

    const renderFlights = (flights: UserFlight[]) => (
        <ListGroup as="ol" numbered>
            {flights.map((flight) => (
                <ListGroup.Item key={flight.id} as="li" className="mb-3">
                    <div className="ms-2 me-auto">
                        <div><strong>Airline:</strong> {flight.airline}</div>
                        <Row>
                            <Col><strong>Origin:</strong> {flight.departureAirport}</Col>
                            <img
                                src={airplaneIcon}
                                alt='Airplane icon'
                                style={{
                                    width: 50,
                                    height: 50,
                                    objectFit: 'contain',
                                    marginRight: '20%',
                                }}
                            />
                            <Col><strong>Destination:</strong> {flight.arrivalAirport}</Col>
                        </Row>

                        <Row className="mt-2">
                            <Col><strong>Departure Date:</strong> {new Date(flight.flightDate).toLocaleString()}</Col>
                        </Row>
                        <Row>
                            <Col><strong>Arrival gate:</strong> {flight.arrivalGate || "N/A"}</Col>
                            <Col><strong>Arrival terminal:</strong> {flight.arrivalTerminal || "N/A"}</Col>
                        </Row>
                        <Row>
                            <Col><strong>Departure gate:</strong> {flight.departureGate || "N/A"}</Col>
                            <Col><strong>Departure terminal:</strong> {flight.departureTerminal || "N/A"}</Col>
                        </Row>
                        <Button
                            variant="danger"
                            className="mt-2"
                            onClick={() => deleteFlight(email, flight.id)}
                        >
                            Remove your flight
                        </Button>
                    </div>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );

    return (
        <Container className="user-flights-container mt-4">
            <h2 className="mb-4">Your Flights</h2>

            {flights.length === 0 && (
                <Alert variant="info">No flights found for your account.</Alert>
            )}

            {flights.length > 0 && (
                <Tabs
                    id="user-flights-tabs"
                    activeKey={key}
                    onSelect={(k) => setKey(k || 'current')}
                    className="mb-3"
                >
                    <Tab eventKey="current" title="Current Flights">
                        {currentFlights.length > 0 ? renderFlights(currentFlights) : (
                            <Alert variant="info">You have no current flights.</Alert>
                        )}
                    </Tab>
                    <Tab eventKey="archived" title="Archived Flights">
                        {archivedFlights.length > 0 ? renderFlights(archivedFlights) : (
                            <Alert variant="info">You have no archived flights.</Alert>
                        )}
                    </Tab>
                </Tabs>
            )}
        </Container>
    );
};

export default UserFlights;
