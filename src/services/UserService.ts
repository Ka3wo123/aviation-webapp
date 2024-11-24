import axios, { AxiosInstance } from "axios";
import { AviationUser } from "../types/AviationUser";
import { from, map, Observable } from "rxjs";
import FlightSubmission from "../types/FlightSubmission";
import UserFlight from "../types/UserFlight";
import FlightPayload from "../types/FlightPayload";
import ExceptionResponse from "../types/exceptions/ExceptionResponse";
import UserAirlineRatio from "../types/stats/UserAirlineRatio";
import CreatedAtUser from "../types/stats/CreatedAtUser";

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

    public getUserAirlineRatio(): Observable<UserAirlineRatio[]> {
        return from(
            this._axios.get("/api/user-stats/airline", {
                headers: {
                    Authorization: `Bearer ${this.getToken()}`
                }
            })
        ).pipe(
            map(response => response.data)
        )
    }

    public getBlockedUsersCount(): Observable<number> {
        return from(
            this._axios.get("/api/user-stats/blocked", {
                headers: {
                    Authorization: `Bearer ${this.getToken()}`
                }
            })
        ).pipe(
            map(response => response.data)
        )
    }

    public getCreatedAtUsers(): Observable<CreatedAtUser[]> {
        return from(
            this._axios.get("/api/user-stats/created", {
                headers: {
                    Authorization: `Bearer ${this.getToken()}`
                }
            })
        ).pipe(
            map(response => response.data)
        )
    }

    public getOneByEmail(email: string): Observable<AviationUser> {
        return from(
            this._axios.get(`/api/user/${email}`, {
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
                age: user?.age,
                role: user?.role
            }).then(response => response)
        )
    }

    public setNewPassword(email: string, password: string) {
        return from(
            this._axios.patch(`/api/user/update-password`, {
                email: email,
                password: password
            }).then(response => response)
                .catch(err => {
                    if (err.status === 400) {
                        throw { status: 400, message: "Password violations" };
                    } else {
                        throw err;
                    }
                })
        )
    }

    public setUserStatus(email: string, toBlock: boolean | undefined) {
        return from(
            this._axios.patch(`/api/user/${email}/status`, {
                toBlock: toBlock
            }, {
                headers: {
                    Authorization: `Bearer ${this.getToken()}`
                }
            }).then(response => console.log(response))
                .catch(err => {
                    throw err;
                })
        )
    }

    public deleteUser(email: string) {
        return from(
            this._axios.delete(`/api/user/${email}`, {
                headers: {
                    Authorization: `Bearer ${this.getToken()}`
                }
            })
        )
    }

    public saveFlightForUser(flightSubmission: FlightSubmission) {
        const payload: FlightPayload = {
            email: flightSubmission.email,
            flight: {
                airline: flightSubmission.airline,
                flightId: flightSubmission.flightId,
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
            }
            ).then(
                response => response.data
            ).catch((err: ExceptionResponse) => {
                if (err.status === 409) {
                    throw { status: err.status, message: err.message }
                }
            })
        );
    }

    public deleteFlight(email: string | undefined, flightId: number) {
        return from(this._axios.delete(`/api/user/${email}/flight/${flightId}`, {
            headers: {
                Authorization: `Bearer ${this.getToken()}`
            }
        }));
    };

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
