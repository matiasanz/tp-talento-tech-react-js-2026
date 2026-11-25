import Home from "../views/Home"
import Movie from "../views/Movie"
import Cart from "../views/Cart"
import paths from "./paths"
import About from "../views/About"
import Error from "../views/Error"
import Admin from "../views/Admin"
import Purchase from "../views/Purchase"
import { UserRole } from "../../js/domain/users"

export default [
    {
        path: paths.HOME,
        element: <Home/>,
        alias: [paths.PRODUCTS]
    },
    {
        path: paths.PRODUCT(":productId"),
        element: <Movie/>
    },
    {
        path: paths.ABOUT,
        element: <About/>
    },
    {
        path: paths.CART,
        element: <Cart/>
    },
    {
        path: paths.PURCHASE(":purchaseId"),
        requireRole: [UserRole.CLIENT, UserRole.ADMIN],
        element: <Purchase/>
    },
    {
        path: paths.ADMIN,
        requireRole: UserRole.ADMIN,
        element: <Admin/>
    },
    {
        path: "*",
        element: <Error status={404}/>
    },
]