import { Routes, Route } from "react-router-dom"
import routes from "./routes"

export default () => (
    <Routes>
        {
            routes.map(({path, element}) => 
                <Route key={path} path={path} element={element()}/>                    
            )
        }
    </Routes>
)

