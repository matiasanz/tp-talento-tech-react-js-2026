import { Routes, Route } from "react-router-dom"
import routes from "./routes"
import { useSessionUser } from "../context/session"

export default () => {
    const {sessionUser} = useSessionUser()

    return (
        <Routes>
            {
                routes.map(({path, element, alias, requireRole}) => admitRoute(requireRole, sessionUser)?
                    <>
                        { ARoute(path, element) }
                        { alias && alias.map(a => ARoute(a, element)) }
                    </>: null
                )
            }
        </Routes>
    )
}

const ARoute = (path, element) => 
    <Route key={path} path={path} element={element}/>

const admitRoute = (requireRole, user) =>  
    ( !requireRole || requireRole.length === 0 )
    || ( user && requireRole.includes(user.role) )