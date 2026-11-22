import { useState, useEffect } from "react";

export default ({children, isLoaded, delay = 300}) => {
    if(isLoaded){
        return children
    }
    
    const [show, setShow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShow(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);
    
    return show? (
        <img src="/assets/content/loading.gif" alt="loading"/>
    ): null
}