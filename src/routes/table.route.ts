import { Router, Request, Response } from 'express';
import Routes from '@interfaces/routes.interface';
import * as tableControllers from '../controllers/tables.controller';
import * as validations from '../utils/validations/tableValidations/index';
import { checkRole } from '../middlewares/checkRole.middleware';
import { checkJwt } from '../middlewares/checkToken.middleware';
import { Roles } from '../utils/types/roles.types';
const router: Router = Router();

router.get(`/`, [checkJwt, checkRole([Roles.ADMIN])], async (req: Request, res: Response) => {
    try {
        const response = await tableControllers.getAllTables();
        res.status(response.status).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error: ${error}`);
    }
});

router.post(`/`, [checkJwt, checkRole([Roles.ADMIN]), validations.createTableValidation], async (req: Request, res: Response) => {
    try {
        const restaurantID = req.body.restaurantId;
        delete req.body.restaurantId;
        const response = await tableControllers.createTable(restaurantID, req.body);
        res.status(response.status).json(response);

    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error`);
    }
});


router.get(`/:id`, [checkJwt, checkRole([Roles.ADMIN]), validations.getOrDeleteTableByIdValidation], async (req: Request, res: Response) => {
    try {
        const response = await tableControllers.getTableById(req.params.id);
        res.status(response.status).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error`);
    }
});

router.put(`/:id`, [checkJwt, checkRole([Roles.ADMIN]), validations.getOrDeleteTableByIdValidation, validations.updateTableByIdValidation], async (req: Request, res: Response) => {
    try {
        const response = await tableControllers.updateTableById(req.params.id, req.body);
        res.status(response.status).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error`);
    }
});

router.delete(`/:id`, [checkJwt, checkRole([Roles.ADMIN]), validations.getOrDeleteTableByIdValidation], async (req: Request, res: Response) => {
    try {
        const response = await tableControllers.deleteTableById(req.params.id);
        res.status(response.status).json(response);

    } catch (error) {
        console.error(`error occurred at route, ${req.path}, error`);
    }
})
export default { router: router, path: 'tables' } as Routes;

