import { Router, Request, Response } from 'express';
import Routes from '@interfaces/routes.interface';
import * as tableControllers from '../controllers/tables.controller';
import * as validations from '../utils/validations/tableValidations/index'
const router: Router = Router();

router.get(`/`, async (req: Request, res: Response) => {
    try {
        const response = await tableControllers.getAllTables();
        res.status(response.status).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error: ${error}`);
    }
});

router.post(`/`, [validations.createTableValidation], async (req: Request, res: Response) => {
    try {
        const restaurantID = req.body.restaurantId;
        delete req.body.restaurantId;
        const response = await tableControllers.createTable(restaurantID, req.body);
        res.status(response.status).json(response);

    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error`);
    }
});


router.get(`/:id`, [validations.getOrDeleteTableByIdValidation], async (req: Request, res: Response) => {
    try {
        const response = await tableControllers.getTableById(req.params.id);
        res.status(response.status).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error`);
    }
});

router.put(`/:id`, [validations.getOrDeleteTableByIdValidation, validations.updateTableByIdValidation], async (req: Request, res: Response) => {
    try {
        const response = await tableControllers.updateTableById(req.params.id, req.body);
        res.status(response.status).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error`);
    }
});

router.delete(`/:id`, [validations.getOrDeleteTableByIdValidation], async (req: Request, res: Response) => {
    try {
        const response = await tableControllers.deleteTableById(req.params.id);
        res.status(response.status).json(response);

    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error`);
    }
})
export default { router: router, path: 'tables' } as Routes;

