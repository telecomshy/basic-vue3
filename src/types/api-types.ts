export interface Role {
    id: number | null,
    roleName: string | null
}

export interface UserBase {
    id: number | null,
    username: string | null,
    email: string | null,
    phoneNumber: string | null
}

export interface User extends UserBase {
    roles: Role[]
}

export interface UpdateUserData extends UserBase {
    roles: number[]
}
