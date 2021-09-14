import App from './app';
import indexRoutes from './routes/index.route';
import restaurantsRoutes from './routes/restaurants.route';
const app: App = new App([indexRoutes,restaurantsRoutes]);
// start listening
app.listen();

