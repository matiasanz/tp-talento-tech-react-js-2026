import { createContext, useState, useContext } from "react";
import {Cart} from "../js/domain/cart"

const cartContext = createContext();

export function useCart() {
    const context = useContext(cartContext);
    if (!context) {
        throw new Error("useCart must be called inside CartProvider");
    }

    return context;
}

export function CartProvider({ children }) {
    const [cart, _] = useState(new Cart());

    return (
        <cartContext.Provider value={cart}>
            {children}
        </cartContext.Provider>
    );
}
