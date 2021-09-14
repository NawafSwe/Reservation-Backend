import { Router, Request, Response } from 'express';
import Routes from '@interfaces/routes.interface'
import * as reservationControllers from '../controllers/reservation.controller';
const router: Router = Router();

router.get(`/`, async (req: Request, res: Response) => {
    try {
        // available reservations
        if (req.query.by === 'timeSlots') {
            const restaurantId = req.body.restaurantId;
            delete req.body.restaurantId;
            const response = await reservationControllers.listAllAvailableReservations(restaurantId, req.body);
            res.status(200).json(response);
        }
        else {
            const response = await reservationControllers.getAllReservation();
            res.status(200).json(response);
        }
    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error: ${error}`);
    }
});

router.get(`/:id`, async (req: Request, res: Response) => {
    try {
        const response = await reservationControllers.getReservationById(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error`)
    }
});

router.post(`/:id`, async (req: Request, res: Response) => {
    try {
        const response = await reservationControllers.reserveTable(req.params.tableId, req.body);
        res.status(201).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error: ${error}`);
    }
});

router.put(`/:id`, async (req: Request, res: Response) => {
    try {
        const response = await reservationControllers.updateReservationById(req.params.id, req.body);
        res.status(201).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error: ${error}`);
    }
});


router.delete(`/:id`, async (req: Request, res: Response) => {
    try {
        const response = await reservationControllers.deleteReservationById(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error: ${error}`);
    }
});
export default { router: router, path: 'reservations' } as Routes;

