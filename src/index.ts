import App from './app';
import indexRoutes from './routes/index.route';
import restaurantsRoutes from './routes/restaurants.route';
import tablesRoutes from './routes/table.route';
import reservationsRoutes from './routes/reservation.route';
import usersRoutes from './routes/users.route';
import authRoutes from './routes/auth.route';

// middle ware to validate user data and auth for all routes 
const app: App = new App([indexRoutes, restaurantsRoutes, tablesRoutes, reservationsRoutes, usersRoutes, authRoutes]);
// start listening
app.listen();

