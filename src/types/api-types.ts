export interface Role {
    id: string,
    roleName: string
}

interface UserBase {
    id: number,
    username: string,
    email: string,
    phoneNumber: string
}

export interface User extends UserBase {
    roles: Role[]
}

export interface UpdateUser extends UserBase {
    roles: number[]
}
