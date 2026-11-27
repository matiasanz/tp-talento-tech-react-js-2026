import { createContext, useState, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "../../js/domain/users";
import { useEffect } from "react";
import { auth } from "../../js/repositories/firebase/client/config";
import UsersRepo from "../../js/repositories/firebase/users_read_repo";
import { useErrorHandler } from "./error_handler";
import { logout } from "../../js/repositories/firebase/login";

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
    const {handleError} = useErrorHandler()

    useEffect(()=>{
        const unsubscribe = onAuthStateChange(async(userData) => {

            let user = null
            if(userData){
                user = new User(userData)

                try{
                    user.role = await fetchUserRole(user)
                } catch(err){
                    logout().finally(()=>
                        handleError(err)
                    )
                    
                    return
                }
            }

            setSessionUser(user)
            setSessionLoaded(true)
        })

        return unsubscribe
    }, [])

    return (
        <sessionUserContext.Provider value={{sessionUser, sessionLoaded}}>
            {children}
        </sessionUserContext.Provider>
    );
}

const fetchUserRole = (user) => UsersRepo.findById(user.id, {onSnaphot: true})
    .then( ({role}) => role )
