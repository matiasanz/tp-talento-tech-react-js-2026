import { createContext, useState, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { User, UserRole } from "../../js/domain/users";
import { useEffect } from "react";
import { auth } from "../../js/repositories/firebase/client/config";
import UsersRepo from "../../js/repositories/firebase/users_read_repo";
import { useErrorHandler } from "./error_handler";
import { logout } from "../../js/repositories/firebase/login";
import { useMemo } from "react";

const sessionUserContext = createContext();

export function useSessionUser() {
    const context = useContext(sessionUserContext);
    if (!context) {
        throw new Error("useSessionUser must be called inside SessionUserProvider");
    }

    return context;
}

export function onAuthStateChange(consumer){
    return onAuthStateChanged(auth, consumer)
}

export function SessionUserProvider({ children }) {
    const [sessionUser, setSessionUser] = useState(null);
    const [sessionLoaded, setSessionLoaded] = useState(false)
    const [userRole, setUserRole] = useState("")
    const {handleError} = useErrorHandler()

    const user = useMemo(()=> sessionUser? ({
        ...sessionUser,
        exists: !!sessionUser,
        role: userRole,
        isLoaded: sessionLoaded
    }): {exists: false, isLoaded: sessionLoaded}, [userRole, sessionUser, sessionLoaded])

    useEffect(()=>{
        const unsubscribe = onAuthStateChange(async(userData) => {
            let u = userData? new User(userData): null
            setSessionUser(u)
            setSessionLoaded(true)

            if(!u){
                setUserRole("")
                return
            }
            
            fetchUserRole(u)
                .then(setUserRole)
                .catch(err => logout().finally(()=>handleError(err)))            
        })        

        return unsubscribe
    }, [])
https://github.com/matiasanz/tp-talento-tech-react-js-2026/pull/22/conflict?name=tp-talento-tech-react-js-2026%252Fsrc%252Freact%252Fcontext%252Fsession.jsx&ancestor_oid=40ea1eeed90e52108508135af007eddb8fe75896&base_oid=3c7077d007bd0b4eca6b266eace21a04a516ae49&head_oid=c5d0d6b9a9d5bdd5cbbc5d56da99b188add25d71
    return (
        <sessionUserContext.Provider value={{user}}>
            {children}
        </sessionUserContext.Provider>
    )
    
}

const fetchUserRole = async(user) => UsersRepo.findById(user.id, {onSnaphot: true})
    .then( ({role}) => role )
