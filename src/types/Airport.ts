import AirportMarker from "./Marker";


export default interface Airport {
    marker: AirportMarker,
    id: string,
    gmt: string,
    airportId: string,
    iataCode: string,
    cityIataCode: string,
    cityName: string,
    icaoCode: string,
    countryIso2: string,
    geonameId: string,
    latitude: string,
    longitude: string,
    airportName: string,
    countryName: string,
    timezone: string

}