import axios, { Axios } from "axios";
import { from, map, Observable } from "rxjs";
import Airport from "../types/Airport";

class AirportService {
    constructor(private readonly _axios: Axios) { }

    public getAirports(): Observable<Airport[]> {
        return from(
            this._axios.get("/api/flight-data/airports")
        ).pipe(
            map(response => response.data)
        )
    }
}

const airportService = new AirportService(axios.create({ baseURL: process.env.REACT_APP_IP_FLIGHTSERVICE }));

export default airportService;