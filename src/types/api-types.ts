export interface Role {
    id: number,
    roleName: string
}

export interface User {
    id: number,
    username: string,
    email: string,
    phoneNumber: string
    roles: Role[]
}
