import axios, { Axios } from "axios";
import { BehaviorSubject, from, tap } from "rxjs";

class AuthService {
    private authSubject = new BehaviorSubject<boolean>(false);
    authState$ = this.authSubject.asObservable();

    constructor(
        private readonly _axios: Axios
    ) { }

    public login(email: string, password: string) {
        return from(
            this._axios.post(`/login`, {
                username: email,
                password: password
            }).then(response => {
                const { access_token } = response.data;
                this.saveToken(access_token);
                return response;
            })
        ).pipe(
            tap(() => {
                this.authSubject.next(true);
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
                if (err.status === 404) {
                    throw { status: 404, message: "The submitted credentials are not connected to an existing user." };
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

    public logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('receiverEmail');
        this.authSubject.next(false);
    }

    private saveToken(token: string): void {
        localStorage.setItem("accessToken", token);
    }
}

const authService = new AuthService(axios.create({ baseURL: process.env.REACT_APP_IP_AUTHSERVICE }));

export default authService;
