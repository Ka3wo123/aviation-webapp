import { useEffect, useState } from 'react';
import { Offcanvas, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import FlightService from '../services/FlightService';
import FlightData from '../types/FlightData';
import styles from '../styles/FlightDetails.module.css';
import { formatDate } from '../utils/FormatDate';

interface AirportDetailsProps {
    show: boolean;
    handleClose: () => void;
    airportName: string;
    airportIata: string;
}

const AirportDetails = ({ show, handleClose, airportName, airportIata }: AirportDetailsProps) => {
    const [flightArrivals, setArrivals] = useState<FlightData[]>([]);
    const [flightDepartures, setDepartures] = useState<FlightData[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getArrivals = () => {
            FlightService.getArrivalsToAirport(airportIata).subscribe({
                next: (arrivals: FlightData[]) => setArrivals(arrivals),
                error: (error: unknown) => console.error(error)
            });
        }


        const getDepartures = () => {

            FlightService.getDeparturesFromAirport(airportIata).subscribe({
                next: (departures: FlightData[]) => setDepartures(departures),
                error: (error: unknown) => console.error(error)
            });
        }

        getArrivals();
        getDepartures();

    }, [airportIata]);



    const handleFlightPick = (flightData: FlightData) => {
        navigate('/flight/search', { state: { flightData: flightData } });
    };

    return (
        <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: '1000px' }}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title className={styles.offcanvasHeader}>{airportName}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <h2>Arrivals</h2>
                <div className={styles.gridContainer}>
                    {flightArrivals && flightArrivals.map((arrival, index) => (
                        <div key={index} className={styles.arrivalDetails}>
                            <div><strong>Airline:</strong> {arrival.airline.name}</div>
                            <div><strong>Terminal:</strong> {arrival.arrival.terminal ? `${arrival.arrival.terminal}` : <span className={styles.na}>N/A</span>}</div>
                            <div><strong>Gate:</strong> {arrival.arrival.gate ? `${arrival.arrival.gate}` : <span className={styles.na}>N/A</span>} </div>
                            <div><strong>Baggage:</strong> {arrival.arrival.baggage ? `${arrival.arrival.baggage}` : <span className={styles.na}>N/A</span>}</div>
                            <div><strong>Delay:</strong> {arrival.arrival.delay ? `${arrival.arrival.delay} min` : <span className={styles.onTime}>On time</span>}</div>
                            <div><strong>Estimated arrival:</strong> {formatDate(arrival.arrival.estimated)}</div>
                        </div>
                    ))}
                </div>
                <hr />
                <h2>Departures</h2>
                <div className={styles.gridContainer}>
                    {flightDepartures && flightDepartures.map((departure, index) => (
                        <OverlayTrigger key={index} placement='top' overlay={<Tooltip>Pick this flight</Tooltip>}>
                            <div className={styles.departureDetails} onClick={() => handleFlightPick(departure)}>
                                <div><strong>Destination:</strong> {departure.arrival.airport} {departure.cityName}</div>
                                <div><strong>Airline:</strong> {departure.airline?.name}</div>
                                <div><strong>Terminal:</strong> {departure.departure.terminal ? `${departure.departure.terminal}` : <span className={styles.na}>N/A</span>}</div>
                                <div><strong>Gate:</strong> {departure.departure.gate ? `${departure.departure.gate}` : <span className={styles.na}>N/A</span>}</div>
                                <div><strong>Delay:</strong> {departure.departure.delay ? `${departure.departure.delay} min` : <span className={styles.onTime}>On time</span>}</div>
                                <div><strong>Scheduled departure:</strong> {formatDate(departure.departure.scheduled)}</div>
                                <div><strong>Estimated departure:</strong> {formatDate(departure.departure.estimated)}</div>
                            </div>
                        </OverlayTrigger>
                    ))}
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default AirportDetails;
