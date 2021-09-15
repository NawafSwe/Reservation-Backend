import { Router, Request, Response } from 'express';
import Routes from '@interfaces/routes.interface';
import * as controllers from '../controllers/restaurants.controller';
const router: Router = Router();
import * as validations from '../utils/validations/restaurantValidations/index';
import { checkRole } from '../middlewares/checkRole.middleware';
import { checkJwt } from '../middlewares/checkToken.middleware';
import { Roles } from '../utils/types/roles.types';

router.get(`/`, [checkJwt, checkRole([Roles.ADMIN])], async (req: Request, res: Response) => {
    try {
        const response = await controllers.getAllRestaurants();
        res.status(response.status).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error: ${error}`);
    }
});
router.post(`/`, [checkJwt, checkRole([Roles.ADMIN]), validations.createRestaurantValidation], async (req: Request, res: Response) => {
    try {
        const response = await controllers.createRestaurant(req.body);
        res.status(response.status).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error: ${error}`);
    }
});

router.get(`/:id`, [checkJwt, checkRole([Roles.ADMIN]), validations.getOrDeleteRestaurantByIdValidation], async (req: Request, res: Response) => {
    try {
        const response = await controllers.getRestaurantById(req.params.id);
        res.status(response.status).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error: ${error}`);
    }
});

router.delete(`/:id`, [checkJwt, checkRole([Roles.ADMIN]), validations.getOrDeleteRestaurantByIdValidation], async (req: Request, res: Response) => {
    try {
        const response = await controllers.deleteRestaurantById(req.params.id);
        res.status(response.status).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error: ${error}`);
    }
});

router.put(`/:id`,
    [checkJwt, checkRole([Roles.ADMIN]), validations.getOrDeleteRestaurantByIdValidation, validations.updateRestaurantByIdValidation],
    async (req: Request, res: Response) => {
        try {
            const response = await controllers.updateRestaurantById(req.params.id, req.body);
            res.status(response.status).json(response);
        } catch (error) {
            console.error(`error occurred at route, ${req.path}, error: ${error}`);
        }
    });

export default { router: router, path: 'restaurants' } as Routes;