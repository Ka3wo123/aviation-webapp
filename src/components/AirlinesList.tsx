import { useEffect, useState } from 'react';
import { Form, ListGroup, Container, Row, Col, Alert } from 'react-bootstrap';
import '../styles/AirlinesList.css';
import airlineService from '../services/AirlineService';
import Airline from '../types/Airline';

const AirlinesList = () => {
    const [airlines, setAirlines] = useState<Airline[]>([]);
    const [filteredAirlines, setFilteredAirlines] = useState<Airline[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        airlineService.getAllAirlines().subscribe({
            next: (response: Airline[]) => {
                setAirlines(response);
                setFilteredAirlines(response);
            },
            error: (err: unknown) => console.error(err),
        });
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = airlines.filter((airline) =>
                airline.airlineName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredAirlines(filtered);
        } else {
            setFilteredAirlines(airlines);
        }
    }, [searchTerm, airlines]);

    return (
        <Container className="airlines-list-container mt-4">
            <h2 className="mb-4">Airlines</h2>

            <Form.Control
                type="text"
                placeholder="Search for an airline..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
            />

            {filteredAirlines.length > 0 ? (
                <ListGroup as="ol" numbered>
                    {filteredAirlines.map((airline) => (
                        <ListGroup.Item key={airline.id} as="li">
                            <div className="ms-2 me-auto">
                                <Row>
                                    <Col><strong>Name:</strong> {airline.airlineName}</Col>                                    
                                </Row>
                                <Row className="mt-2">
                                    <Col><strong>IATA:</strong> {airline.iataCode}</Col>
                                    <Col><strong>ICAO:</strong> {airline.icaoCode}</Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col><strong>Call sign:</strong> {airline.callsign}</Col>
                                    <Col><strong>Date founded:</strong> {airline.dateFounded}</Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col><strong>Country name:</strong> {airline.countryName}</Col>
                                    <Col><strong>Fleet size:</strong> {airline.fleetSize}</Col>
                                </Row>
                                <Row className="mt-2">                                    
                                    <Col><strong>Hub code:</strong> {airline.hubCode}</Col>
                                    <Col><strong>Fleet average size:</strong> {airline.fleetAverageAge}</Col>
                                </Row>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <Alert variant="info">No airlines match your search.</Alert>
            )}
        </Container>
    );
};

export default AirlinesList;
