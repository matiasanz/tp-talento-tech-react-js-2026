import { Routes, Route, useLocation, matchPath, useNavigate } from "react-router-dom"
import routes from "./routes"
import { onAuthStateChange, useSessionUser } from "../context/session"
import paths from "./paths"
import { useEffect } from "react"

export default () => {
    const { user } = useSessionUser()
    const navigate = useNavigate()
    const { pathname } = useLocation()

    useEffect(()=>{
        const unsubscribe = onAuthStateChange(user=>{
            if(!user.exists){
                const route = routes.find(({path}) => matchPath({path}, pathname))
                if(route === null){
                    return
                }
    
                if(route.requireRole !== undefined){
                    navigate(paths.HOME)
                }
            }
        })

        return unsubscribe
    }, [])

    return (
        <Routes>
            {
                routes.map(({path, element, alias, requireRole}) => admitRoute(requireRole, user)?
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