import APIError from "./apiError";

export default class APIResponse {
    public data: any;
    public status: number;
    public errors?: Array<APIError>;
    constructor(data: any, status: number, errors?: Array<APIError>) {
        this.data = data;
        this.status = status;
        this.errors = errors === null ? [] : errors;
    }
}