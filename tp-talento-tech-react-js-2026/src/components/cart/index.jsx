import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import paths from "../../router/paths"
import {useCart} from "../../context/cart"

export default () =>  { 
    const cart = useCart()

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
            <li>
                <Link to={paths.PRODUCT(id)}>{detail}</Link>    
            </li>
            <li>{quantity}</li>
        </ul>
    </li>   
)