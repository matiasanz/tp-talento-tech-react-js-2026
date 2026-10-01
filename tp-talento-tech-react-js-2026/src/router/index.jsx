import { Routes, Route } from "react-router-dom"
import routes from "./routes"

export default () => (
    <Routes>
        {
            routes.map(({path, element, alias}) => 
                <>
                    { ARoute(path, element) }
                    { alias && alias.map(a => ARoute(a, element)) }
                </>
            )
        }
    </Routes>
)

const ARoute = (path, element) => 
    <Route key={path} path={path} element={element()}/>
