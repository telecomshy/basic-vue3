export interface Role {
    id: number,
    roleName: string
}

export interface UserBase {
    id: number,
    username: string,
    email: string,
    phoneNumber: string
}

export interface User extends UserBase {
    roles: Role[]
}

export interface UpdateUserData extends UserBase {
    roles: number[]
}
