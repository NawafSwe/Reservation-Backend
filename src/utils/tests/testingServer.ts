import express from 'express';
import restaurantRouter from '../../routes/restaurants.route';
const dotenv = require('custom-env');
const getServer = () => {
    process.env.NODE_ENV = 'testing';
    dotenv.env(process.env.NODE_ENV);
    const app = express();
    app.use(express.json());
    app.use(`/${restaurantRouter.path}`, restaurantRouter.router);
    const httpServer = require('http').createServer(app);
    return httpServer;
}
export default getServer;