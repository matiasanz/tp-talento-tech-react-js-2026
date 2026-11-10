import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import paths from "../../router/paths"
import {useCart} from "../../context/cart"

export default () =>  { 

    const cart = useCart()

    cart.addItem({id: 1, detail: "ble", quantity: 56})

    return (<>
        <ul>
            { cart.items.map(Item) }
        </ul>
    </>)
}

const Item = ({id, detail, quantity}) => (
    
        <li key={id}>
            <h2>Item #{id}</h2>
            <ul>
                <li>{detail}</li>
                <li>{quantity}</li>
            </ul>
        </li>
    
)