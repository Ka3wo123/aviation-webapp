import React, { useState, ChangeEvent, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import FlightData from '../types/FlightData';
import styles from '../styles/FlightForm.module.css';
import tileStyles from '../styles/FlightSearch.module.css';
import AirportService from '../services/AirportService';
import Airport from '../types/Airport';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import FlightService from '../services/FlightService';
import { formatDate } from '../utils/FormatDate';
import airlineIcon from '../assets/icons/airplane.png';
import { validateJWTToken } from '../utils/CheckToken';
import userService from '../services/UserService';
import UserService from '../services/UserService';
import FlightSubmission from '../types/FlightSubmission';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const FlightForm: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { flightData } = location.state as { flightData: FlightData } || { flightData: null };
    const [airports, setAirports] = useState<Airport[]>([]);
    const [departure, setDeparture] = useState<FlightData | null>(flightData ? flightData : null);
    const [arrival, setArrival] = useState<FlightData | null>(flightData ? flightData : null);
    const [flightDate, setFlightDate] = useState<Date | undefined>(flightData ? new Date(flightData.departure.scheduled) : undefined);
    const [searchTriggered, setSearchTriggered] = useState<boolean>(false);
    const [retrievedFlights, setRetrievedFlights] = useState<FlightData[]>([]);
    const [isValidToken, setIsValidToken] = useState<boolean>(validateJWTToken());
    const [flightSubmission, setFlightSubmission] = useState<FlightSubmission>();

    useEffect(() => {
        AirportService.getAirports().subscribe(airports => {
            airports = airports.sort((a, b) => a.airportName.localeCompare(b.airportName));
            setAirports(airports);
        });
    }, []);

    const handleOriginAirportChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedAirport = airports.find(airport => airport.iataCode === e.target.value);
        if (selectedAirport) {
            setDeparture(prevDeparture => ({
                ...prevDeparture,
                departure: {
                    ...(prevDeparture?.departure || {}),
                    airport: selectedAirport.airportName,
                    iata: selectedAirport.iataCode
                }
            } as FlightData));
        }
    };

    const handleDestinationAirportChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedAirport = airports.find(airport => airport.iataCode === e.target.value);
        if (selectedAirport) {
            setArrival(prevArrival => ({
                ...prevArrival,
                arrival: {
                    ...(prevArrival?.arrival || {}),
                    airport: selectedAirport.airportName,
                    iata: selectedAirport.iataCode
                }
            } as FlightData));
        }
    };

    const handleDateChange = (date: Date | null) => {
        setFlightDate(date || undefined);
    };

    const handleSearch = () => {
        const formattedDate = flightDate ? formatDate(flightDate.toString()) : undefined;

        FlightService.getFlights(departure?.departure.iata, arrival?.arrival.iata, formattedDate).subscribe(
            (response: any) => {
                setRetrievedFlights(response);
                setSearchTriggered(true);
            }
        );
    };

    const handleAddToFlights = (flight: FlightData) => {
        if (!isValidToken) {
            navigate('/auth', { state: { from: location } });
        } else {            
            const token = localStorage.getItem("accessToken");
            let email: string | undefined;

            if (token) {
                const decodedToken: any = jwtDecode(token);
                email = decodedToken?.sub;
            }

            const flightToSave: FlightSubmission = {
                email: email || '',
                departureAirport: flight.departure.airport,
                arrivalAirport: flight.arrival.airport,
                flightDate: flight.flightDate,
                departureTerminal: flight.departure.terminal,
                departureGate: flight.departure.gate,
                arrivalTerminal: flight.arrival.terminal,
                arrivalGate: flight.arrival.gate
            };
            
            UserService.saveFlightForUser(flightToSave).subscribe(() => {
                toast.success(`Added flight from ${flightToSave.departureAirport} to ${flightToSave.arrivalAirport} for user ${email}`)
            });
        }
    };

    return (
        <>
            <div className={styles.form}>
                <h2 className={styles.header}>Search flight</h2>
                <Form>
                    <Form.Group className="mb-3" controlId="formAssignedTo">
                        <Form.Label>Origin airport</Form.Label>
                        <Form.Select
                            value={departure?.departure?.airport}
                            onChange={handleOriginAirportChange}
                            required
                        >
                            <option value="">{departure ? `${departure?.departure?.airport} (${departure?.departure?.iata})` : "Choose an airport..."}</option>
                            {airports.map(airport => (
                                <option key={airport.airportId} value={airport.iataCode}>
                                    {airport.airportName} ({airport.iataCode})
                                </option>
                            ))}
                        </Form.Select>

                        <Form.Label>Destination airport</Form.Label>
                        <Form.Select
                            value={arrival?.arrival?.airport}
                            onChange={handleDestinationAirportChange}
                            required
                        >
                            <option value="">{arrival ? `${arrival?.arrival?.airport} (${arrival?.arrival?.iata})` : "Choose an airport..."}</option>
                            {airports.map(airport => (
                                <option key={airport.airportId} value={airport.iataCode}>
                                    {airport.airportName} ({airport.iataCode})
                                </option>
                            ))}
                        </Form.Select>

                        <Form.Label>Flight Date</Form.Label>
                        <DatePicker
                            selected={flightDate}
                            onChange={handleDateChange}
                            dateFormat="dd.MM.yyyy"
                            className="form-control"
                            placeholderText="Select flight date"
                        />
                    </Form.Group>

                    <Button variant="primary" type="button" onClick={handleSearch}>
                        Search
                    </Button>
                </Form>
            </div>

            {flightData && (
                <div>
                    <div className={tileStyles.container} >
                        <h4>{flightData.airline?.name || "N/A"}</h4>
                        <div className={tileStyles.arrivalDetails}>
                            <div><strong>Origin airport:</strong> {flightData.departure?.airport || "N/A"}</div>
                            <div><strong>Terminal:</strong> {flightData.departure?.terminal || "-"}</div>
                            <div><strong>Gate:</strong> {flightData.departure?.gate || "-"}</div>
                        </div>
                        <img src={airlineIcon} style={{ width: '2%', transform: 'rotate(90deg)', marginTop: 5, marginBottom: 5 }} alt="Airline Icon" />
                        <div className={tileStyles.arrivalDetails}>
                            <div><strong>Destination airport:</strong> {flightData.arrival?.airport || "N/A"}</div>
                            <div><strong>Terminal:</strong> {flightData.arrival?.terminal || "-"}</div>
                            <div><strong>Gate:</strong> {flightData.arrival?.gate || "-"}</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, marginBottom: 20 }}>
                            <Button style={{ width: 200 }} onClick={() => handleAddToFlights(flightData)}>
                                {isValidToken ? "Add to your flights" : "Login to add this flight"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {searchTriggered && retrievedFlights.length > 0 && (
                <div>
                    {retrievedFlights.map(flight => (
                        <div className={tileStyles.container} >
                            <h4>{flight.airline?.name || "N/A"}</h4>
                            <div className={tileStyles.arrivalDetails}>
                                <div><strong>Origin airport:</strong> {flight.departure?.airport || "N/A"}</div>
                                <div><strong>Terminal:</strong> {flight.departure?.terminal || "-"}</div>
                                <div><strong>Gate:</strong> {flight.departure?.gate || "-"}</div>
                            </div>
                            <img src={airlineIcon} style={{ width: '2%', transform: 'rotate(90deg)', marginTop: 5, marginBottom: 5 }} alt="Airline Icon" />
                            <div className={tileStyles.arrivalDetails}>
                                <div><strong>Destination airport:</strong> {flight.arrival?.airport || "N/A"}</div>
                                <div><strong>Terminal:</strong> {flight.arrival?.terminal || "-"}</div>
                                <div><strong>Gate:</strong> {flight.arrival?.gate || "-"}</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, marginBottom: 20 }}>
                                <Button style={{ width: 200 }} onClick={() => handleAddToFlights(flight)}>
                                    {isValidToken ? "Add to your flights" : "Login to add this flight"}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default FlightForm;
