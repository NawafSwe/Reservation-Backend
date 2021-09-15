import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { httpStatus } from '../../serverUtils/httpStatus';
import APIResponse from '../../serverUtils/APIResponse';
import APIError from '../../serverUtils/apiError';
const validate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = Joi.object({
            id: Joi.string().required()
        });
        const { error } = schema.validate(req.params, { stripUnknown: true });
        if (!error) {
            return next();
        } else {
            const apiResponse = new APIResponse({}, httpStatus.BAD_REQUEST.code, [
                new APIError(httpStatus.BAD_REQUEST, error.message)]);
            return res
                .status(httpStatus.BAD_REQUEST.code)
                .json(apiResponse);
        }
    } catch (error) {
        console.error(`error occurred at getOrDeleteReservation validation, error: ${error}`);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR.code)
            .json(new APIResponse({},
                httpStatus.INTERNAL_SERVER_ERROR.code,
                [new APIError(httpStatus.INTERNAL_SERVER_ERROR, httpStatus.INTERNAL_SERVER_ERROR.message)]))
    }
}
export default validate;