import {Router, Request, Response} from 'express';
import Routes from '@interfaces/routes.interface'

const indexRouter: Router = Router();
indexRouter.get(`/health`, (req: Request, res: Response) => {
    res.status(200).json({$message: 'Server is Alive'});
});
export default {router: indexRouter, path: '/'} as Routes;

