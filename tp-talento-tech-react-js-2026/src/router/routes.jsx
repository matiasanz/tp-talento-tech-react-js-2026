import Home from "../views/Home"
import Movie from "../views/Movie"
import samples from "../views/Samples"
import paths from "./paths"

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
        element: <samples.About/>
    },
    {
        path: "*",
        element: <samples.NotFound/>
    },
]