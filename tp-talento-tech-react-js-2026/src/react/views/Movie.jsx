import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { MovieEntry } from '../components/MovieListings'

import paths from "../router/paths"
import moviesRepo from "../../js/repositories/movies_repo"
import { useCart } from "../context/cart"
import { Item } from "../../js/domain/cart"
import { useErrorHandler } from "../context/error_handler"

export default () => {
    const {handleError} = useErrorHandler()

    const {productId} = useParams()
    const [movie, setMovie] = useState({})
    const navigate = useNavigate()
    const cart = useCart()

    useEffect(()=>{
        moviesRepo.findById(productId)
            .then(setMovie)
            .catch(handleError)
    }, [productId])

    return (
        <>
            <MovieEntry {...movie}/>
            <button onClick={()=>onClickAddTicketToCart(cart, movie, navigate)}>Comprar entrada</button>
        </>
    )
}

function onClickAddTicketToCart(cart, movie, navigate){
    cart.addItem(new Item(movie.id, movie.title, 1))
    navigate(paths.CART)
}