/**
 * @module httpStatus
 * @description module holds http error codes for every case
 */

/**
 * @namespace httpStatus
 * @description object holds http status codes for each response
 */

 export const httpStatus = {
    CONTINUE: {message: 'CONTINUE', code: 100},
    OK: {message: 'OK', code: 200},
    CREATED: {message: 'CREATED', code: 201},
    ACCEPTED: {message: 'ACCEPTED', code: 202},
    NON_AUTHORITATIVE_INFORMATION: {message: 'Non_Authoritative_Information', code: 203},
    NO_CONTENT: {message: 'NO CONTENT', code: 204},
    PARTIAL_CONTENT: {message: 'PARTIAL CONTENT', code: 206},
    MOVED_PERMANENTLY: {message: 'MOVED PERMANENTLY', code: 301},
    FOUND: {message: 'FOUND', code: 302},
    NOT_MODIFIED: {message: 'NOT MODIFIED', code: 304},
    BAD_REQUEST: {message: 'BAD REQUEST', code: 400},
    UNAUTHORIZED: {message: 'UNAUTHORIZED', code: 401},
    FORBIDDEN: {message: 'FORBIDDEN', code: 403},
    PAYMENT_REQUIRED: {message: 'PAYMENT REQUIRED', code: 402},
    NOT_FOUND: {message: 'NOT_FOUND', code: 404},
    METHOD_NOT_ALLOWED: {message: 'METHOD NOT ALLOWED', code: 405},
    NOT_ACCEPTABLE: {message: 'NOT ACCEPTABLE', code: 406},
    REQUEST_TIMEOUT: {message: 'REQUEST TIMEOUT', code: 408},
    CONFLICT: {message: 'CONFLICT', code: 409},
    NO_RESPONSE: {message: 'NO RESPONSE', code: 444},
    CLIENT_CLOSED_REQUEST: {message: 'CLIENT CLOSED REQUEST', code: 499},
    INTERNAL_SERVER_ERROR: {message: 'INTERNAL SERVER ERROR', code: 500},
    NOT_IMPLEMENTED: {message: 'NOT IMPLEMENTED', code: 501},
    SERVICE_UNAVAILABLE: {message: 'SERVICE UNAVAILABLE', code: 503},
    NETWORK_READ_TIMEOUT_ERROR: {message: 'NETWORK READ TIMEOUT ERROR', code: 598},
    NETWORK_CONNECT_TIMEOUT_ERROR: {message: 'NETWORK CONNECT TIMEOUT ERROR ', code: 599},
};
