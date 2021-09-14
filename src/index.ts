import App from './app';
import indexRoutes from './routes/index.route';
import restaurantsRoutes from './routes/restaurants.route';
import tablesRoutes from './routes/table.route';
const app: App = new App([indexRoutes, restaurantsRoutes, tablesRoutes]);
// start listening
app.listen();

