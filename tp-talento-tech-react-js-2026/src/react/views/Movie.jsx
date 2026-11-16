import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MovieEntry } from '../components/MovieListings'

import paths from "../router/paths"
import { useErrorHandler } from "../context/error_handler"

import { useCart } from "../context/cart"
import { Item } from "../../js/domain/cart"

import moviesRepo from "../../js/repositories/movies_read_repo"
import Loading from "../components/Loading"
import showingsRepo from "../../js/repositories/showings_repo"

export default () => {
    const {handleError} = useErrorHandler()

    const {productId} = useParams()
    const [movie, setMovie] = useState({})
    const navigate = useNavigate()
    const cart = useCart()
    const [showings, setShowings] = useState([]) 
    const [selectedShowing, setSelectedShowing] = useState(null)

    useEffect(()=>{
        moviesRepo.findById(productId)
            .then(setMovie)
            .catch(handleError)

        showingsRepo.findByMovieId(productId)
            .then(setShowings)
            .catch(handleError)
    
    }, [productId])

    return (
        <>
            <Loading isLoaded={movie.id}>
                <MovieEntry {...movie}/>
            </Loading>

            <Loading isLoaded={showings.length}>
                <form onSubmit={()=>onClickAddTicketToCart(cart, movie, navigate)}>
                    {
                        showings.map( ({id, dateTime}, index) =>{                            
                            return <div key={`showing-${id}`}>
                                {index!=0 && (<br/>)}

                                <input type="radio"
                                    value={id}
                                    id={`showing-${id}-input`}
                                    checked={ selectedShowing === id} 
                                    onChange={ onChangeSelectedShowing(setSelectedShowing) } 
                                />
                                <label htmlFor={`showing-${id}-input`}>{formatDateTime(dateTime)}</label>
                            </div>
                        })
                    }

                    <input type="submit" value="Comprar entrada"/>
                </form>
            </Loading>
        </>
    )
}

function onClickAddTicketToCart(cart, movie, navigate){
    cart.addItem(new Item(movie.id, movie.title, 1))
    navigate(paths.CART)
}

const onChangeSelectedShowing = (setSelectedShowing) => ({target: {value}}) => {
    setSelectedShowing(value)
}

function formatDateTime(dateTime){
    return dateTime
//    return `${dateTime.getUTCDate().padStart(2)}/${dateTime.getUTCMonth().padStart(2)} a las ${dateTime.getUTCHour().padStart(2)}:${dateTime.getUTCMinutes().padStart(2)} hs`
}