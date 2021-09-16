import { Router, Request, Response, query } from 'express';
import Routes from '@interfaces/routes.interface'
import * as reservationControllers from '../controllers/reservation.controller';
import * as userControllers from '../controllers/user.controller';
import { checkRole } from '../middlewares/checkRole.middleware';
import { checkJwt } from '../middlewares/checkToken.middleware';
import { Roles } from '../utils/types/roles.types';
import * as userValidations from '../utils/validations/usersValidations/index';

const router: Router = Router();


router.get(`/reservations`, [checkJwt, checkRole([Roles.ADMIN])], async (req: Request, res: Response) => {
    try {
        const restaurantId = req.body.restaurantId;
        delete req.body.restaurantId;

        const response = await reservationControllers.listAllAvailableReservations(restaurantId);
        res.status(response.status).json(response);

    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error: ${error}`);
    }
});

// getAllReservations
router.get('/pagination/reservation', async (req: Request, res: Response) => {
    try {
        if (req.query.skip && req.query.to && req.body.period) {
            const skip = Number(req.query.skip);
            const to = Number(req.query.to);
            const response = await reservationControllers.getAllReservations(skip, to, req.body.period);
            res.status(response.status).json(response);
        }
        else {
            const response = await reservationControllers.getAllReservations();
            res.status(response.status).json(response);
        }
    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error: ${error}`);
    }
});


router.post('/addAdmin', userValidations.createUserValidation, async (req: Request, res: Response) => {
    try {

        const response = await userControllers.createUser({
            ...req.body, role: Roles.ADMIN
        });
        // if user created then send the token in the headers
        res.status(response.status).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error`);
    }
});
export default { router: router, path: 'admin' } as Routes;

