import axios, { Axios } from "axios";
import { from, map, Observable } from "rxjs";
import FlightData from '../types/FlightData';
import City from "../types/City";

class FlightService {
    constructor(
        private readonly _axios: Axios
    ) { }

    public getFlights(originAirportIata?: string, destinationAirportIata?: string, flightData?: string): Observable<FlightData[]> {
        return from(this._axios.get(`/api/flight-data/flights`, {
            params: {
                departureIata: originAirportIata,
                arrivalIata: destinationAirportIata,
                flightData: flightData
            }
        })).pipe(
            map(response => response.data)
        );
    }

    public getArrivalsToAirport(airportIata: string): Observable<FlightData[]> {
        return from(this._axios.get(`/api/flight-data/arrivals/${airportIata}`))
            .pipe(
                map(response => response.data)
            );
    }

    public getCityByIataCode(iataCode: string): Observable<City> {
        return from(this._axios.get(`/api/city/${iataCode}`))
            .pipe(
                map(response => response.data)
            );
    }

    public getDeparturesFromAirport(airportIata: string): Observable<FlightData[]> {
        return from(this._axios.get(`/api/flight-data/flights/${airportIata}`))
            .pipe(
                map(response => response.data)
            );
    }
}

const flightService =  new FlightService(axios.create({ baseURL: process.env.REACT_APP_IP_FLIGHTSERVICE }));

export default flightService;