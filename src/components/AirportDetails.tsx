import { useEffect, useState } from 'react';
import { Offcanvas } from 'react-bootstrap';
import FlightService from '../services/FlightSerivce';
import FlightData from '../types/FlightData';
import styles from '../styles/FlightDetails.module.css';
import { format } from 'date-fns';

interface AirportDetailsProps {
    show: boolean;
    handleClose: () => void;
    airportName: string;
    airportIata: string;
}

const AirportDetails = ({ show, handleClose, airportName, airportIata }: AirportDetailsProps) => {
    const [arrivals, setArrivals] = useState<FlightData[]>([]);
    const [departures, setDepartures] = useState<FlightData[]>([]);

    useEffect(() => {
        FlightService.getArrivalsToAirport(airportIata).subscribe({
            next: (arrivals: FlightData[]) => setArrivals(arrivals),
            error: (error: unknown) => console.error(error)
        });

        FlightService.getDeparturesFromAirport(airportIata).subscribe({
            next: (departures: FlightData[]) => setDepartures(departures),
            error: (error: unknown) => console.error(error)
        });
    }, [airportIata]);

    const formatDate = (date: string) => {
        return format(new Date(date), 'dd-MM-yyyy');
    }

    return (
        <Offcanvas show={show} onHide={handleClose} placement="end" style={{ width: '1000px' }}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title className={styles.offcanvasHeader}>{airportName}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <h2>Arrivals</h2>
                <div className={styles.gridContainer}>
                    {arrivals && arrivals.map((arrival, index) => (
                        <div key={index} className={styles.flightDetails}>
                            <div><strong>Airline:</strong> {arrival.airline.name}</div>
                            <div><strong>Terminal:</strong> {arrival.arrival.terminal ? `${arrival.arrival.terminal}` : <span className={styles.na}>N/A</span>}</div>
                            <div><strong>Gate:</strong> {arrival.arrival.gate ? `${arrival.arrival.gate}` : <span className={styles.na}>N/A</span>} </div>
                            <div><strong>Baggage:</strong> {arrival.arrival.baggage ? `${arrival.arrival.baggage}` : <span className={styles.na}>N/A</span>}</div>
                            <div><strong>Delay:</strong> {arrival.arrival.delay ? `${arrival.arrival.delay} min` : <span className={styles.onTime}>On time</span>}</div>
                            <div><strong>Estimated Arrival:</strong> {formatDate(arrival.arrival.estimated)}</div>
                        </div>
                    ))}                    
                </div>
                <hr />
                <h2>Departures</h2>
                <div className={styles.gridContainer}>
                    {departures && departures.map((departure, index) => (
                        <div key={index} className={styles.flightDetails}>
                            <div><strong>Airline:</strong> {departure.airline.name}</div>
                            <div><strong>Terminal:</strong> {departure.departure.terminal ? `${departure.departure.terminal}` : <span className={styles.na}>N/A</span>}</div>
                            <div><strong>Gate:</strong> {departure.departure.gate ? `${departure.departure.gate}` : <span className={styles.na}>N/A</span>}</div>
                            <div><strong>Delay:</strong> {departure.departure.delay ? `${departure.departure.delay} min` : <span className={styles.onTime}>On time</span>}</div>
                            <div><strong>Scheduled:</strong> {formatDate(departure.departure.scheduled)}</div>
                            <div><strong>Estimated Departure:</strong> {formatDate(departure.departure.estimated)}</div>
                        </div>
                    ))}
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default AirportDetails;
