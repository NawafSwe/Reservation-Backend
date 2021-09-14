import helmet from 'helmet';
import morgan from 'morgan';
import { Application } from 'express';
import Routes from '@interfaces/routes.interface';
import express from 'express';
import dbConnection from './config/db.config';

const dotenv = require('custom-env');

export default class App {
    public app: Application;
    private PORT: number;
    private HOST: string;
    private env: string;

    constructor(routes: Array<Routes>) {
        this.app = express();
        this.env = (process.env.NODE_ENV || 'development').trim();
        dotenv.env(this.env);
        this.PORT = Number(process.env.PORT) || 3000;
        this.HOST = process.env.HOST || 'localhost';
        this.configApp();
        this.initRoutes(routes);
    }

    public listen(): void {
        this.app.listen(this.PORT, async () => {
            await dbConnection();
            console.debug(`=================================`);
            console.debug(`======= ENV: ${this.env} =======`);
            console.debug(`🚀 server running on http://${this.HOST}:${this.PORT}`);
            console.debug(`=================================`);

        });
    }

    private initRoutes(routes: Array<Routes>): void {
        for (let router of routes)
            this.app.use(`/${router.path}`, router.router);
    }

    private configApp(): void {
        this.app.use(express.json({}));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(morgan('tiny'));
        this.app.use(helmet());
    }
}

