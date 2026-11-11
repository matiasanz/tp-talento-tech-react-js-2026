import { Link } from "react-router-dom"
import paths from "../router/paths"
import {useCart} from "../context/cart"

export default () =>  { 
    const cart = useCart()
    return cart.items.length > 0? (<>
        <ul>
            { cart.items.map(i => Item(i, cart)) }
        </ul>

        <button onClick={()=>onClickClearCart(cart)}>
            <img src="/assets/icons/delete.svg"/>
            Vaciar carrito
        </button>
    </>): (<p>Aún no has marcado ningún item. ¿Qué esperas?</p>)
}

const Item = ({id, detail, quantity}, cart) => (
    <li key={id}>
        <h2>Item #{id}</h2>
        <ul>
            <li>
                <Link to={paths.PRODUCT(id)}>{detail}</Link>    
            </li>
            <li>{quantity}</li>
        </ul>

        <button onClick={()=>onClickDeleteItem(id, cart)}>
            <img src="/assets/icons/delete.svg"/>
            Eliminar
        </button>
    </li>   
)

function onClickDeleteItem(itemId, cart){
    cart.removeItemById(itemId)
}

function onClickClearCart(cart){
    cart.clear()
}