import axios, { Axios } from "axios";
import { from } from "rxjs";

class AuthService {
    constructor(
        private readonly _axios: Axios
    ) { }

    public login(email: string, password: string,) {
        return from(
            this._axios.post(`/login`,
                {
                    username: email,
                    password: password
                }
            ).then(response => {
                const { access_token } = response.data;
                this.saveToken(access_token);
                return response.data;
            })
                .catch(err => {
                    console.error("Auth failed " + err)
                })
        )
    }

    private saveToken(token: string): void {
        localStorage.setItem("accessToken", token);
    }

    private getToken(): string | null {
        return localStorage.getItem("accessToken");
    }
}

export default new AuthService(axios.create({ baseURL: process.env.REACT_APP_IP_AUTHSERVICE }));