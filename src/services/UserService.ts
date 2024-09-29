import axios, { AxiosInstance } from "axios";
import { AviationUser } from "../types/AviationUser";
import { from, map, Observable } from "rxjs";

class UserService {
    constructor(private readonly _axios: AxiosInstance) {}

    public getUsers(): Observable<AviationUser[]> {
        const token = localStorage.getItem('accessToken');
        return from(
            this._axios.get("http://localhost:8082/api/user/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        ).pipe(
            map(response => response.data)
        )
    }
}

export default new UserService(axios.create({ baseURL: "http://localhost:8082" }));
