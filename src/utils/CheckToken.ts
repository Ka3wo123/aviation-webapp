import { jwtDecode } from "jwt-decode";

export const validateJWTToken = () => {
    const token = localStorage.getItem("accessToken");

    if (token) {                
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp > currentTime) {
            return true;
        }
    } 
    return false;
}