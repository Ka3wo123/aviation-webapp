export enum Role {
    USER = "USER",
    ADMIN = "ADMIN"
}

export interface AviationUser {
    name: string,
    surname: string,
    email: string,
    password: string,
    phoneNumber?: string | undefined,
    age?: number | undefined,
    role: Role,
    isBlocked?: boolean
}