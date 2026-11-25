import { Link } from "react-router-dom"
import paths from "../../../router/paths"
import { useState, useEffect } from "react"
import { onAuthStateChange } from "../../../context/session"
import { UserRole } from "../../../../js/domain/users"
import { useSessionUser } from "../../../context/session"
const {HOME, ABOUT, CART, ADMIN} = paths

export default () => {
    const [userRole, setUserRole] = useState("")
    const {sessionUser} = useSessionUser()
    
    useEffect(() => {
        setUserRole( sessionUser ? sessionUser.role : "");
    }, [sessionUser])


    return (<>
        <nav style={{ padding: '10px', background: '#eee', marginBottom: '20px' }}>
            <Link to={HOME} style={{ marginRight: '15px' }}>Inicio</Link>
            <Link to={ABOUT} style={{ marginRight: '15px' }}>Acerca de</Link>
            <Link to={CART}>Carrito</Link>
            { 
                userRole === UserRole.ADMIN && (
                    <Link to={ADMIN} style={{ marginLeft: '15px' }}>Administración</Link>
                )
            }
        </nav>
    </>)
}