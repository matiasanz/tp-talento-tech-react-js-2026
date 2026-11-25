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

    const { user } = useSessionUser() 


    const onClickConfirmPurchase = withPreventDefault(()=>{
        onConfirmPurchase(setMessage, navigate)
            (user, cart)
    })

    return cart.items.length > 0? (<>
        <ul>
            { cart.items.map((item, index) => Item({canEdit: true, item, cart, index})) }
        </ul>

        {
            !user.isLoaded? "Verificando sesión...":
            !user.exists? (<p>Aún no haz iniciado sesión, hazlo para poder confirmar la compra.</p>): (
                <div>
                    <button onClick={onClickConfirmPurchase}>Confirmar Compra</button>
                    <p>{message}</p>
                </div>
            )
        }

        <button onClick={()=>onClickClearCart(cart)}>
            <img src="/assets/icons/delete.svg"/>
            Vaciar carrito
        </button>

    </>): (<p>Aún no has marcado ningún item. ¿Qué esperas?</p>)
}


const onConfirmPurchase = (setMessage, navigate) => (user, cart, dateTime = new Date()) => {
    if(!user.exists){
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