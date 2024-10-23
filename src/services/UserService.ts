import axios, { AxiosInstance } from "axios";
import { AviationUser } from "../types/AviationUser";
import { from, map, Observable } from "rxjs";
import FlightSubmission from "../types/FlightSubmission";
import UserFlight from "../types/UserFlight";

class UserService {
    constructor(private readonly _axios: AxiosInstance) { }

    public getUsers(): Observable<AviationUser[]> {
        return from(
            this._axios.get("/api/user/users", {
                headers: {
                    Authorization: `Bearer ${this.getToken()}`
                }
            })
        ).pipe(
            map(response => response.data)
        )
    }

    public registerUser(user: AviationUser) {
        return from(
            this._axios.post("/api/user", {
                name: user.name,
                surname: user.surname,
                email: user.email,
                password: user.password,
                phoneNumber: user?.phoneNumber,
                age: user?.age
            }).then(response => response)
        )
    }

    public saveFlightForUser(flightSubmission: FlightSubmission) {
        const payload = {
            email: flightSubmission.email,
            flight: {
                airline: flightSubmission.airline,
                departureAirport: flightSubmission.departureAirport,
                arrivalAirport: flightSubmission.arrivalAirport,
                flightDate: flightSubmission.flightDate,
                departureTerminal: flightSubmission.departureTerminal,
                departureGate: flightSubmission.departureGate,
                arrivalTerminal: flightSubmission.arrivalTerminal,
                arrivalGate: flightSubmission.arrivalGate
            }
        };

        return from(
            this._axios.post("/api/user/flight", payload, {
                headers: {
                    Authorization: `Bearer ${this.getToken()}`
                }
            }).then(response => response.data)
                .catch(err => {
                    console.error(err);
                    throw err;
                })
        );
    }

    public getFlightsForUser(email: string): Observable<UserFlight[]> {
        return from(this._axios.get(`/api/user/${email}/flights`, {
            headers: {
                Authorization: `Bearer ${this.getToken()}`
            }
        }).then(
            response => response.data
        ).catch(
            err => {
                console.error(err);
                throw err;
            }
        ))
    }

    private getToken(): string | null {
        return localStorage.getItem('accessToken');
    }

}

const userService = new UserService(axios.create({ baseURL: process.env.REACT_APP_IP_USERSERVICE }));

export default userService;
