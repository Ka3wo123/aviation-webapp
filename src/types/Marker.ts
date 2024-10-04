import { LatLngExpression } from "leaflet";

export default interface AirportMarker {
    geocode: LatLngExpression,
    airportName: string,
    cityName: string,
    iata: string
}