import { Router, Request, Response } from 'express';
import Routes from '@interfaces/routes.interface'
import * as authServices from '../services/auth.service';
const router: Router = Router();

router.post(`/login`, async (req: Request, res: Response) => {
    try {
        const response = await authServices.login(req.body);
        // if logged in successfully set token and remove it from body before sending to client
        response.status === 200 ? (res.setHeader('token', response.data.token) && delete response.data.token) : null;
        res.status(response.status).json(response);
    } catch (error) {
        console.error(`error occurred at route ${req.url}, error: ${error}`);
    }
});
export default { router: router, path: 'api/auth' } as Routes;

