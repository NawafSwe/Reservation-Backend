import express from 'express';
import restaurantRouter from '../../routes/restaurants.route';
import authRoute from '../../routes/auth.route';
import userRoute from '../../routes/users.route';
import tableRoute from '../../routes/table.route';
import reservationRoute from '../../routes/reservation.route';
import adminRoute from '../../routes/admin.route';
const getServer = () => {
    const app = express();
    app.use(express.json());
    app.use(`/${restaurantRouter.path}`, restaurantRouter.router);
    app.use(`/${authRoute.path}`, authRoute.router);
    app.use(`/${userRoute.path}`, userRoute.router);
    app.use(`/${tableRoute.path}`, tableRoute.router);
    app.use(`/${reservationRoute.path}`, reservationRoute.router);
    app.use(`/${adminRoute.path}`, adminRoute.router);

    const httpServer = require('http').createServer(app);
    return httpServer;
}
export default getServer;