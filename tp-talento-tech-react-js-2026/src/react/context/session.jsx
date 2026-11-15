import { createContext, useState, useContext } from "react";
import { User } from "../../js/domain/users";

const sessionUserContext = createContext();

export function useSessionUser() {
    const context = useContext(sessionUserContext);
    if (!context) {
        throw new Error("useSessionUser must be called inside SessionUserProvider");
    }

    return context;
}

export function SessionUserProvider({ children }) {
    const [sessionUser, setSessionUser] = useState(null);

    return (
        <sessionUserContext.Provider value={{sessionUser, onLogin: onLogin(setSessionUser), onLogout: onLogout(setSessionUser)}}>
            {children}
        </sessionUserContext.Provider>
    );
}

const onLogin = setSessionUser => loginResult => {
    setSessionUser(new User(loginResult.user))    
}

const onLogout = setSessionUser => () => {
    setSessionUser(null)
}