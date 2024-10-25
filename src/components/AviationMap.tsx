import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { Icon } from 'leaflet';
import 'leaflet-routing-machine';
import AirportMarker, { toLatLngTuple } from '../types/Marker';
import customMarkerIcon from '../assets/icons/location-pin.png';
import userMarkerIcon from '../assets/icons/location-home.png';
import { Accordion, Form } from 'react-bootstrap';
import AirportService from '../services/AirportService';
import Airport from '../types/Airport';
import AirportDetails from './AirportDetails';
import '../styles/AviationMap.css';

const MapComponent = () => {
    const [markers, setMarkers] = useState<AirportMarker[]>([]);
    const [airportSearchTerm, setAirportSearchTerm] = useState<string>('');
    const [countrySearchTerm, setCountrySearchTerm] = useState<string>('');
    const [citySearchTerm, setCitySearchTerm] = useState<string>('');
    const [filteredAirports, setFilteredAirports] = useState<AirportMarker[]>([]);
    const [selectedAirport, setSelectedAirport] = useState<AirportMarker | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [radius, setRadius] = useState<number>(0);

    const airportMarker = new Icon({
        iconUrl: customMarkerIcon,
        iconSize: [38, 38],
    });

    const userMarker = new Icon({
        iconUrl: userMarkerIcon,
        iconSize: [38, 38],
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation([position.coords.latitude, position.coords.longitude]);
            },
            (error) => console.error("Error getting user location:", error)
        );
    }, []);

    useEffect(() => {
        const sub = AirportService.getAirports().subscribe({
            next: (airports: Airport[]) => {
                const airportGeocode: AirportMarker[] = airports.map(airport => ({
                    geocode: [parseFloat(airport.latitude), parseFloat(airport.longitude)],
                    airportName: airport.airportName,
                    cityName: airport.cityName,
                    countryName: airport.countryName,
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
        const lowercasedCityTerm = citySearchTerm.toLowerCase();
        const lowercasedCountryTerm = countrySearchTerm.toLowerCase();

        const filtered = markers.filter(marker => {
            const isWithin = radius > 0 && userLocation ? calculateDistance(userLocation, toLatLngTuple(marker.geocode)) <= radius : true;
            return (
                marker.airportName.toLowerCase().includes(lowercasedAirportTerm) &&
                (marker.cityName ? marker.cityName?.toLowerCase().includes(lowercasedCityTerm) : true) &&
                (marker.countryName ? marker.countryName?.toLowerCase().includes(lowercasedCountryTerm) : true) &&
                isWithin
            );

        });
        setFilteredAirports(filtered);
    }, [airportSearchTerm, countrySearchTerm, citySearchTerm, markers, radius]);

    const calculateDistance = (loc1: [number, number], loc2: [number, number]) => {
        const R = 6371;
        const dLat = (loc2[0] - loc1[0]) * (Math.PI / 180);
        const dLon = (loc2[1] - loc1[1]) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(loc1[0] * (Math.PI / 180)) * Math.cos(loc2[0] * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

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
                        icon={airportMarker}
                        eventHandlers={{
                            click: () => handleMarkerClick(marker),
                        }}>
                        <Popup>
                            <p>{marker.airportName}</p>
                        </Popup>
                    </Marker>
                ))}
                {userLocation && (
                    <Marker position={userLocation} icon={userMarker}>
                        <Popup>Your Location</Popup>
                    </Marker>
                )}
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
                            <Form.Group controlId="citySearch">
                                <Form.Label>Search by city name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter city name"
                                    value={citySearchTerm}
                                    onChange={(e) => setCitySearchTerm(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="countrySearch">
                                <Form.Label>Search by country name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter country name"
                                    value={countrySearchTerm}
                                    onChange={(e) => setCountrySearchTerm(e.target.value)}
                                />
                            </Form.Group>
                            {userLocation &&
                                <Form.Group controlId="radius">
                                    <Form.Label>Search by Radius (km)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter radius"
                                        value={radius}
                                        onChange={(e) => setRadius(Number(e.target.value))}
                                    />
                                </Form.Group>

                            }
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