import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { httpStatus } from '../../serverUtils/httpStatus';
import APIResponse from '../../serverUtils/APIResponse';
import APIError from '../../serverUtils/apiError';
const validate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = Joi.object({
            empNumber: Joi.number().custom((value, helpers) => {
                if (value.toString().length > 4 || value.toString().length < 4) {
                    return helpers.error('empNumber must be exactly 4 digits');
                }
            }).required(),
            password: Joi.string().length(6).required(),
            role: Joi.string().optional()
        });
        const { error } = schema.validate(req.body, { stripUnknown: true });
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
        console.error(`error occurred at createUser validation, error: ${error}`);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR.code)
            .json(new APIResponse({},
                httpStatus.INTERNAL_SERVER_ERROR.code,
                [new APIError(httpStatus.INTERNAL_SERVER_ERROR, httpStatus.INTERNAL_SERVER_ERROR.message)]))
    }
}
export default validate;