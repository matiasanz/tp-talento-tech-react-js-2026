import { createContext, useState, useContext } from "react";
import ErrorView from "../views/Error";
import { NotFoundError } from "../../js/repositories/firebase/client/errors";

const errorHandlerContext = createContext();

export function useErrorHandler() {
    const context = useContext(errorHandlerContext);
    if (!context) {
        throw new Error("useErrorHandler must be called inside ErrorHandlerProvider");
    }

    return context;
}

export function ErrorHandlerProvider({ children }) {
    const [error, setError] = useState(null);

    return (
        <errorHandlerContext.Provider value={{handleError: errorHandler(setError)}}>
            {
                error!=null? (<ErrorView status={getStatus(error)}></ErrorView>)
                : children
            }
        </errorHandlerContext.Provider>
    );
}

const errorHandler = setError => (err) => {
    setError(err)
}

function getStatus(error) {
    switch(error.name){
        case NotFoundError.name:
            return 404
        default:
            return 500
    }
}