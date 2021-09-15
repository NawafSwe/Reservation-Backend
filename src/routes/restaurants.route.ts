import { Router, Request, Response } from 'express';
import Routes from '@interfaces/routes.interface';
import * as controllers from '../controllers/restaurants.controller';
const router: Router = Router();
import * as validations from '../utils/validations/restaurantValidations/index';

router.get(`/`, async (req: Request, res: Response) => {
    try {
        const response = await controllers.getAllRestaurants();
        res.status(200).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error: ${error}`);
    }
});
router.post(`/`, [validations.createRestaurantValidation], async (req: Request, res: Response) => {
    try {
        const response = await controllers.createRestaurant(req.body);
        res.status(201).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error: ${error}`);
    }
});

router.get(`/:id`, async (req: Request, res: Response) => {
    try {
        const response = await controllers.getRestaurantById(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error: ${error}`);
    }
});

router.delete(`/:id`, async (req: Request, res: Response) => {
    try {
        const response = await controllers.deleteRestaurantById(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error: ${error}`);
    }
});

router.put(`/:id`, async (req: Request, res: Response) => {
    try {
        const response = await controllers.updateRestaurantById(req.params.id, req.body);
        res.status(200).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error: ${error}`);
    }
});

export default { router: router, path: 'restaurants' } as Routes;