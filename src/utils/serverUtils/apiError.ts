/**
 * @module APIError
 * @description module holds centralized server error.
 */


export default class APIError extends Error {
    public name:string;
    public statusCode:number;
    public isOperational:boolean;
    public description:string;

    /**
     * @param {Object<httpStatus>} http
     * @param {boolean} isOperational type of the error operational versus programmer
     * @param {string} description of the error
     */
    // custom error we can delete name or isOperational to make it more simple
    constructor(http: any, description: string, isOperational?: boolean) {
        super(description);
        // using object.create for better performance ;;
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = http.message;
        this.statusCode = http.code;
        this.isOperational = isOperational == null ? false : isOperational;
        this.description = description;
        // capture stack of the error 'where it occurred';
        Error.captureStackTrace(this);
    }
}
