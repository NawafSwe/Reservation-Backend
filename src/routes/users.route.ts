import { Router, Request, Response } from 'express';
import Routes from '@interfaces/routes.interface';
import * as controllers from '../controllers/user.controller';

const router: Router = Router();
router.get(`/`, async (req: Request, res: Response) => {
    try {
        const response = await controllers.getAllUsers();
        res.status(200).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error`);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const response = await controllers.getUserById(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error`);
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {

        const response = await controllers.createUser(req.body);
        // if user created then send the token in the headers
        res.status(201).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error`);
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const response = await controllers.updateUserById(req.params.id, req.body);
        res.status(200).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error`);
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const response = await controllers.deleteUserById(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error`);
    }
});

export default { router: router, path: '/users' } as Routes;

