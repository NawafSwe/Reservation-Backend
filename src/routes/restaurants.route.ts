import { Router, Request, Response } from 'express';
import Routes from '@interfaces/routes.interface';
import * as controllers from '../controllers/restaurants.controller';
const router: Router = Router();

export default { router: router, path: '/restaurants' } as Routes;