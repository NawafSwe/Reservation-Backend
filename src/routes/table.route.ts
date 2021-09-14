import { Router, Request, Response } from 'express';
import Routes from '@interfaces/routes.interface';
import * as tableControllers from '../controllers/tables.controller';

const router: Router = Router();

router.get(`/`, async (req: Request, res: Response) => {
    try {
        const response = await tableControllers.getAllTables();
        res.status(200).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error: ${error}`);
    }
});

router.post(`/`, async (req: Request, res: Response) => {
    try {
        const restaurantID = req.body.restaurantId;
        delete req.body.restaurantId;
        const response = await tableControllers.createTable(restaurantID, req.body);
        res.status(201).json(response);

    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error`);
    }
});


router.get(`/:id`, async (req: Request, res: Response) => {
    try {
        const response = await tableControllers.getTableById(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error`);
    }
});

router.put(`/:id`, async (req: Request, res: Response) => {
    try {
        const response = await tableControllers.updateTableById(req.params.id, req.body);
        res.status(200).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error`);
    }
});

router.delete(`/:id`, async (req: Request, res: Response) => {
    try {
        const response = await tableControllers.deleteTableById(req.params.id);
        res.status(200).json(response);

    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error`);
    }
})
export default { router: router, path: 'tables' } as Routes;

