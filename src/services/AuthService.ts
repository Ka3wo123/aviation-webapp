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

    public sendResetPasswordRequest(email: string) {
        return from(
            this._axios.get(`/api/email/send-reset`, {
                params: {
                    receiverEmail: email
                }
            }).then(response => {
                console.log(response);
            }).catch(err => {
                if(err.status === 404) {
                    throw {status: 404, message: "The submitted credentials are not connected to an existing user."};
                }
                throw err;
            })
        );
    }

    public getTokenByEmail(email: string | null) {
        return from(
            this._axios.get(`/api/email`, {
                params: {
                    email: email
                }
            }).then(response => {
                return response.data
            }).catch(err => {
                console.error(err)
            })
        )

    }

    private saveToken(token: string): void {
        localStorage.setItem("accessToken", token);
    }
}

const authService = new AuthService(axios.create({ baseURL: process.env.REACT_APP_IP_AUTHSERVICE }));

export default authService;
