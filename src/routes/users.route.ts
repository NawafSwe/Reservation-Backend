import { Router, Request, Response } from 'express';
import Routes from '@interfaces/routes.interface'

const router: Router = Router();
router.get(`/`, (req: Request, res: Response) => {
    try {

    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error`);
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {

    } catch (error) {
        console.error(`error occurred at route, ${req.url}, error`);
    }
})
export default { router: router, path: '/users' } as Routes;

