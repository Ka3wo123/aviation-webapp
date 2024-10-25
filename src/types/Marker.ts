import { latLng, LatLngExpression } from "leaflet";
import Airport from "./Airport";

export default interface AirportMarker {
    geocode: LatLngExpression,    
    airportName: string,
    cityName: string,
    countryName: string,
    iata: string
}

export const toLatLngTuple = (latLngExp: LatLngExpression): [number, number] => {
    if (Array.isArray(latLngExp)) {
        return latLngExp as [number, number];
    }
    return [latLngExp.lat, latLngExp.lng];

};