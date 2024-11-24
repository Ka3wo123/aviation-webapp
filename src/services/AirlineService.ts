import axios, { Axios } from "axios";
import { from, map, Observable } from "rxjs";
import Airline from "../types/Airline";

class AirlineService {
    constructor(private readonly _axios: Axios) { }

    public getAllAirlines(): Observable<Airline[]> {
        return from(
            this._axios.get("/api/flight-data/airlines")
        ).pipe(
            map(response => response.data)
        )
    }
}

const airportService = new AirlineService(axios.create({ baseURL: process.env.REACT_APP_IP_FLIGHTSERVICE }));

export default airportService;