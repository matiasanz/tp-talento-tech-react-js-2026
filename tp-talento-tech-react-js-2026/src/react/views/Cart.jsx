import { Link } from "react-router-dom"
import paths from "../router/paths"
import {useCart} from "../context/cart"
import { ShowingItem } from "../../js/domain/cart"
import { formatRowLabel } from "../components/SeatMap/utils"
import { formatDateTime } from "../../js/domain/formatters"

export default () =>  { 
    const cart = useCart()
    return cart.items.length > 0? (<>
        <ul>
            { cart.items.map(i => Item(i, cart)) }
        </ul>

        <p><i>Los asientos se confirman al ingresar al establecimiento.</i></p>

        <button onClick={()=>onClickClearCart(cart)}>
            <img src="/assets/icons/delete.svg"/>
            Vaciar carrito
        </button>
    </>): (<p>Aún no has marcado ningún item. ¿Qué esperas?</p>)
}

const Item = (item, cart) => {
    const {id} = item
    return (
        <li key={id}>
            <h2>Item #{id}</h2>
            <ul>
                {
                    item instanceof ShowingItem && (<ShowingItemDetail {...item}/>)
                }
            </ul>

            <button onClick={()=>onClickDeleteItem(id, cart)}>
                <img src="/assets/icons/delete.svg"/>
                Eliminar
            </button>
        </li>   
    )
}

const ShowingItemDetail = ({movie, showing, seats}) => (<>
    <li>
        <Link to={paths.PRODUCT(movie.id)}>{movie.title}</Link>    
    </li>
    <li>{formatDateTime(showing.dateTime)} Sala {showing.auditorium.name}</li>
    <li>{seats.length} butacas: {seats.map(s=>formatSeatLabel(showing, s)).join(", ")}</li>
</>)

function onClickDeleteItem(itemId, cart){
    cart.removeItemById(itemId)
}

function onClickClearCart(cart){
    cart.clear()
}

function formatSeatLabel(showing, seat) {
    const {seatsPerRow} = showing.auditorium
    const row = Math.floor((seat - 1) / seatsPerRow) + 1;
    const column = ((seat - 1) % seatsPerRow) + 1;
    return `${formatRowLabel(row)}-${column}`;
}
