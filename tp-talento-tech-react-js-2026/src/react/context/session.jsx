import { createContext, useState, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { User } from "../../js/domain/users";
import { useEffect } from "react";
import { auth } from "../../js/repositories/firebase/client/config";

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

    useEffect(()=>{
        const unsubscribe = onAuthStateChange(async(user) => {
            setSessionUser(user? new User(user): null)
        })

        return unsubscribe
    }, [])

    return (
        <sessionUserContext.Provider value={{sessionUser}}>
            {children}
        </sessionUserContext.Provider>
    );
}