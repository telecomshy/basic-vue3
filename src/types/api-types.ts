export interface ServiceError {
    code: string,
    message: string
}


export interface RequestResult {
    data: any,
    error: ServiceError
}