import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { httpStatus } from '../../serverUtils/httpStatus';
import APIResponse from '../../serverUtils/APIResponse';
import APIError from '../../serverUtils/apiError';
const validate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const schema = Joi.object({
            staringHoursDate: Joi.string().optional(),
            endingHoursDate: Joi.string().optional(),
            numberOfClients: Joi.number().optional(),
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
        console.error(`error occurred at updateReservation validation, error: ${error}`);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR.code)
            .json(new APIResponse({},
                httpStatus.INTERNAL_SERVER_ERROR.code,
                [new APIError(httpStatus.INTERNAL_SERVER_ERROR, httpStatus.INTERNAL_SERVER_ERROR.message)]))
    }
}
export default validate;