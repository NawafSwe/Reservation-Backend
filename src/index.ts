import App from './app';
import indexRoutes from './routes/index.route';
const app: App = new App([indexRoutes]);
// start listening
app.listen();

