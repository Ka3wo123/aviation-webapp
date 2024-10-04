import axios, { Axios } from "axios";
import { from, map, Observable } from "rxjs";
import FlightData from '../types/FlightData';

class FlightService {
    constructor(
        private readonly _axios: Axios
    ) { }

    public getFlightsFromAirport(airportIata: string): Observable<FlightData[]> {
        return from(this._axios.get(`/api/flight-data/flights`))
            .pipe(
                map(response => response.data)
            );
    }

    public getArrivalsToAirport(airportIata: string): Observable<FlightData[]> {
        return from(this._axios.get(`/api/flight-data/arrivals/${airportIata}`))
        .pipe(
            map(response => response.data)
        );
    }

    public getDeparturesFromAirport(airportIata: string): Observable<FlightData[]> {
        return from(this._axios.get(`/api/flight-data/departures/${airportIata}`))
        .pipe(
            map(response => response.data)
        );
    }
}

export default new FlightService(axios.create({ baseURL: process.env.REACT_APP_IP_FLIGHTSERVICE }));