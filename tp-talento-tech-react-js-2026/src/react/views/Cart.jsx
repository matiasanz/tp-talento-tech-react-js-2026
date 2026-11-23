import { Link } from "react-router-dom"
import paths from "../router/paths"
import {useCart} from "../context/cart"
import { ShowingItem } from "../../js/domain/cart"
import { formatRowLabel } from "../components/features/SeatMap/utils"
import { formatDateTime } from "../../js/domain/formatters"
import { Purchase } from "../../js/domain/purchases"
import PurchaseRepo from "../../js/repositories/firebase/purchase_write_repo"
import { useState } from "react"
import { withPreventDefault } from "../components/utils"
import { onAuthStateChange, useSessionUser } from "../context/session"
import { useEffect } from "react"

export default () =>  { 
    const cart = useCart()
    const [message, setMessage] = useState("")
    

    useEffect(()=>{
        const unsubscribe = onAuthStateChange(()=>{
            setMessage("")
        })

        return unsubscribe
    }, [] )

    const {sessionUser} = useSessionUser() 


    const onClickConfirmPurchase = withPreventDefault(()=>{
        onConfirmPurchase(setMessage)
            (sessionUser, cart.items)
    })

    return cart.items.length > 0? (<>
        <ul>
            { cart.items.map((item, index) => Item(item, cart, index)) }
        </ul>

        <p><i>Los asientos se confirman al ingresar al establecimiento.</i></p>

        <div>
            <button onClick={onClickConfirmPurchase}>Confirmar Compra</button>
            <p>{message}</p>
        </div>
        <button onClick={()=>onClickClearCart(cart)}>
            <img src="/assets/icons/delete.svg"/>
            Vaciar carrito
        </button>
    </>): (<p>Aún no has marcado ningún item. ¿Qué esperas?</p>)
}

const Item = (item, cart, index) => {
    const {id} = item
    return (
        <li key={id}>
            <h2>Item #{index+1}</h2>
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
    <li>{seats.length} butaca{seats.length>1?"s":""}: {formatSeats(showing, seats)}</li>
</>)


const onConfirmPurchase = (setMessage) => (user, items, dateTime = new Date()) => {
    if(user == null){
        setMessage("Primero debe iniciar sesión")
        return
    }

    console.log(JSON.stringify(user, null, 2))

    const purchase = new Purchase(
        items, user.id, dateTime
    )

    PurchaseRepo.insert(purchase)
        .then(inserted=>{
            console.log(JSON.stringify(inserted, null, 2))
        })
        .catch(err=>{
            console.error(err)
            setMessage("Se ha producido un error. Verifique si se realizó la transferencia, reintente y si el problema persiste, comuníquese con la boletería del local.")
        })
}

function onClickDeleteItem(itemId, cart){
    cart.removeItemById(itemId)
}

function onClickClearCart(cart){
    cart.clear()
}

function formatSeats(showing, seats){
    const s = seats.map(s=>formatSeatLabel(showing, s))
    let suffix = ""
    if(s.length>1){
        const lastSeat = s.pop()
        suffix = " & "+lastSeat
    }

    return s.join(", ")+suffix
}

function formatSeatLabel(showing, seat) {
    const {seatsPerRow} = showing.auditorium
    const row = Math.floor((seat - 1) / seatsPerRow) + 1;
    const column = ((seat - 1) % seatsPerRow) + 1;
    return `${formatRowLabel(row)}-${column}`;
}