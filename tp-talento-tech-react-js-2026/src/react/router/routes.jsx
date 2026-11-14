import Home from "../views/Home"
import Movie from "../views/Movie"
import Cart from "../views/Cart"
import paths from "./paths"
import About from "../views/About"
import Error from "../views/Error"

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
        path: "*",
        element: <Error status={404}/>
    },
]