import axios, { Axios } from "axios";
import { from } from "rxjs";

class AuthService {
    constructor(
        private readonly _axios: Axios
    ) { }

    public login(email: string, password: string) {
        return from(
            this._axios.post(`/login`, {
                username: email,
                password: password
            }).then(response => {
                if (response.data._embedded && response.data._embedded.errors) {
                    throw new Error(response.data._embedded.errors[0].message);
                }

                const { access_token } = response.data;
                this.saveToken(access_token);
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

    private saveToken(token: string): void {
        localStorage.setItem("accessToken", token);
    }
}

const authService = new AuthService(axios.create({ baseURL: process.env.REACT_APP_IP_AUTHSERVICE }));

export default authService;
