import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MovieEntry } from '../components/MovieListings'

import paths from "../router/paths"
import { useErrorHandler } from "../context/error_handler"

import { useCart } from "../context/cart"
import { Item } from "../../js/domain/cart"

import moviesRepo from "../../js/repositories/movies_read_repo"
import Loading from "../components/Loading"

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
            <Loading isLoaded={movie.id}>
                <MovieEntry {...movie}/>
            </Loading>
            <button onClick={()=>onClickAddTicketToCart(cart, movie, navigate)}>Comprar entrada</button>
        </>
    )
}

function onClickAddTicketToCart(cart, movie, navigate){
    cart.addItem(new Item(movie.id, movie.title, 1))
    navigate(paths.CART)
}