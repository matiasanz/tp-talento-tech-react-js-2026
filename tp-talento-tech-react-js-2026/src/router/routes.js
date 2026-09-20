import samples from "../views/Samples"
import paths from "./paths"

export default [
    {
        path: paths.HOME,
        element: samples.Home
    },
    {
        path: paths.ABOUT,
        element: samples.About
    },
    {
        path: "*",
        element: samples.NotFound
    }
]