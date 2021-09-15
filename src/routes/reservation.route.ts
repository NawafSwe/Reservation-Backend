import { Router, Request, Response } from 'express';
import Routes from '@interfaces/routes.interface'
import * as reservationControllers from '../controllers/reservation.controller';
const router: Router = Router();
import { getOrDeleteTableByIdValidation } from '../utils/validations/tableValidations/index';
import * as validations from '../utils/validations/reservationValidations/index';

router.get(`/`, async (req: Request, res: Response) => {
    try {
        const response = await reservationControllers.getAllReservation();
        res.status(response.status).json(response);

    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error: ${error}`);
    }
});

router.get(`/:id`, async (req: Request, res: Response) => {
    try {
        const response = await reservationControllers.getReservationById(req.params.id);
        res.status(response.status).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error`)
    }
});

router.post(`/:id`, [getOrDeleteTableByIdValidation, validations.createReservationValidation], async (req: Request, res: Response) => {
    try {
        const response = await reservationControllers.reserveTable(req.params.tableId, req.body);
        res.status(response.status).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error: ${error}`);
    }
});

router.put(`/:id`, [validations.getOrDeleteReservationByIdValidation, validations.updateReservationByIdValidation], async (req: Request, res: Response) => {
    try {
        const response = await reservationControllers.updateReservationById(req.params.id, req.body);
        res.status(response.status).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error: ${error}`);
    }
});


router.delete(`/:id`, [validations.getOrDeleteReservationByIdValidation], async (req: Request, res: Response) => {
    try {
        const response = await reservationControllers.deleteReservationById(req.params.id);
        res.status(response.status).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error: ${error}`);
    }
});
export default { router: router, path: 'reservations' } as Routes;

