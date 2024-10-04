import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import AirportMarker from '../types/Marker';
import customMarkerIcon from '../assets/icons/location-pin.png';
import { Accordion, Form } from 'react-bootstrap';
import AirportService from '../services/AirportService';
import Airport from '../types/Airport';
import AirportDetails from './AirportDetails';
import '../styles/AviationMap.css';

const MapComponent = () => {
    const [airports, setAirports] = useState<Airport[]>([]);
    const [markers, setMarkers] = useState<AirportMarker[]>([]);
    const [airportSearchTerm, setAirportSearchTerm] = useState<string>('');
    const [countrySearchTerm, setCountrySearchTerm] = useState<string>('');
    const [filteredAirports, setFilteredAirports] = useState<AirportMarker[]>([]);
    const [selectedAirport, setSelectedAirport] = useState<AirportMarker | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const customMarker = new Icon({
        iconUrl: customMarkerIcon,
        iconSize: [38, 38],
    });

    useEffect(() => {
        const sub = AirportService.getAirports().subscribe({
            next: (airports: Airport[]) => {
                const airportGeocode: AirportMarker[] = airports.map(airport => ({
                    geocode: [parseFloat(airport.latitude), parseFloat(airport.longitude)],
                    airportName: airport.airportName,
                    cityName: airport.cityName,
                    iata: airport.iataCode
                }));                
                setMarkers(airportGeocode);
                setFilteredAirports(airportGeocode);
            },
            error: (err: unknown) => {
                console.error(err);
            }
        });

        return () => {
            sub.unsubscribe();
        }
    }, []);

    useEffect(() => {
        const lowercasedAirportTerm = airportSearchTerm.toLowerCase();
        const lowercasedCountryTerm = countrySearchTerm.toLowerCase();

        const filtered = markers.filter(marker =>
            marker.airportName.toLowerCase().includes(lowercasedAirportTerm) &&
            marker.airportName.toLowerCase().includes(lowercasedCountryTerm)
        );
        setFilteredAirports(filtered);
    }, [airportSearchTerm, countrySearchTerm, markers]);

    const handleMarkerClick = (marker: AirportMarker) => {
        setSelectedAirport(marker);
        setShowDetails(true);
    };

    return (
        <div style={{ position: 'relative' }}>
            <MapContainer center={[0, 0]} zoom={4} style={{ height: '93vh', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredAirports.map((marker, index) => (
                    <Marker
                        key={index}
                        position={marker.geocode}
                        icon={customMarker}
                        eventHandlers={{
                            click: () => handleMarkerClick(marker),
                        }}>
                        <Popup>
                            <div>
                                <p>{marker.airportName}</p>
                                <p>{marker.cityName}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <Accordion style={{ position: 'absolute', top: '10px', left: '50px', zIndex: 1000 }} className="custom-accordion">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Search Airports</Accordion.Header>
                    <Accordion.Body>
                        <Form>
                            <Form.Group controlId="airportSearch">
                                <Form.Label>Search by Airport Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter airport name"
                                    value={airportSearchTerm}
                                    onChange={(e) => setAirportSearchTerm(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="countrySearch">
                                <Form.Label>Search by Country Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter country name"
                                    value={countrySearchTerm}
                                    onChange={(e) => setCountrySearchTerm(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            {selectedAirport && (
                <AirportDetails
                    show={showDetails}
                    handleClose={() => setShowDetails(false)}
                    airportName={selectedAirport.airportName}
                    airportIata={selectedAirport.iata}
                />
            )}
        </div>
    );
};

export default MapComponent;
