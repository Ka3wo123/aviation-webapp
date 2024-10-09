import axios, { AxiosInstance } from "axios";
import { AviationUser } from "../types/AviationUser";
import { from, map, Observable } from "rxjs";
import FlightSubmission from "../types/FlightSubmission";

class UserService {
    constructor(private readonly _axios: AxiosInstance) { }

    public getUsers(): Observable<AviationUser[]> {
        const token = localStorage.getItem('accessToken');
        return from(
            this._axios.get("/api/user/users", {
                headers: {
                    Authorization: `Bearer ${token}`
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
            }).then(response => {
                if (response.data._embedded && response.data._embedded.errors) {
                    throw new Error(response.data._embedded.errors[0].message);
                }

                return response.status;
            }).catch(err => {
                if (err.response) {
                    console.error("Auth failed: " + err.message || "An error occurred");
                    return err.response.status;
                } else {
                    console.error("Auth failed: " + err.message);
                }
            })
        )
    }

    public saveFlightForUser(flightSubmission: FlightSubmission) {
        const token = localStorage.getItem('accessToken'); // Get the access token
    
        // Create the payload in the required format
        const payload = {
            email: flightSubmission.email,
            flight: {
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
                    Authorization: `Bearer ${token}` // Set the Authorization header
                }
            }).then(response => response.data)
            .catch(err => {
                console.error(err);
                throw err; // Optionally throw the error for further handling
            })
        );
    }
    
}

const userService = new UserService(axios.create({ baseURL: process.env.REACT_APP_IP_USERSERVICE }));

export default userService;
