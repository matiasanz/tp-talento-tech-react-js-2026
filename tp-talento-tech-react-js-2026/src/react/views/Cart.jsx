import {useCart} from "../context/cart"
import { Purchase } from "../../js/domain/purchases"
import PurchaseRepo from "../../js/repositories/purchase_write_repo"
import { useState } from "react"
import { withPreventDefault } from "../components/utils"
import { onAuthStateChange, useSessionUser } from "../context/session"
import { useEffect } from "react"
import Item from "../components/features/Items"
import paths from "../router/paths"
import { useNavigate } from "react-router-dom"

export default () =>  { 
    const cart = useCart()
    const [message, setMessage] = useState("")
    const navigate = useNavigate()


    useEffect(()=>{
        const unsubscribe = onAuthStateChange(()=>{
            setMessage("")
        })

        return unsubscribe
    }, [] )

    const {sessionUser} = useSessionUser() 


    const onClickConfirmPurchase = withPreventDefault(()=>{
        onConfirmPurchase(setMessage, navigate)
            (sessionUser, cart)
    })

    return cart.items.length > 0? (<>
        <ul>
            { cart.items.map((item, index) => Item({canEdit: true, item, cart, index})) }
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


const onConfirmPurchase = (setMessage, navigate) => (user, cart, dateTime = new Date()) => {
    if(user == null){
        setMessage("Primero debe iniciar sesión")
        return
    }

    const {items} = cart
    const purchase = new Purchase(
        items, user.id, dateTime
    )

    PurchaseRepo.insert(purchase)
        .then(({id})=>{
            cart.clear()
            navigate(paths.PURCHASE(id))
        }) 
        .catch(err=>{
            console.error(err)
            setMessage("Se ha producido un error. Verifique si se realizó la transferencia, reintente y si el problema persiste, comuníquese con la boletería del local.")
        })
}

function onClickClearCart(cart){
    cart.clear()
}