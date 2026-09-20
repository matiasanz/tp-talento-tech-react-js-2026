import {HOME, ABOUT} from "./paths";

const Home = () => <h2>Página de Inicio 🏠</h2>;
const About = () => <h2>Acerca de Nosotros ℹ️</h2>;
const NotFound = () => <h2>Error 404: Página no encontrada ❌</h2>;

const routes = [
    {
        path: HOME,
        element: Home
    },
    {
        path: ABOUT,
        element: About
    },
    {
        path: "*",
        element: NotFound
    }
]

export default {routes, paths}