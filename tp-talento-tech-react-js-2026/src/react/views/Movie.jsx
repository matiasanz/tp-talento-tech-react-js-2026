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

import { SeatMap } from "../components/SeatMap3"

export default () => {
    const {handleError} = useErrorHandler()

    const {productId} = useParams()
    const [movie, setMovie] = useState(null)
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
            <Loading isLoaded={movie}>
                <MovieEntry {...movie}/>
            </Loading>

            <Loading isLoaded={showings.length}>
                <form onSubmit={()=>onClickAddTicketToCart(cart, movie, navigate)}>
                    {
                        showings.map( ({id, dateTime}, index) =>{                            
                            return <div key={`showing-${id}`}>
                                {index!=0 && (<br/>)}

                                <input type="radio"
                                    id={`showing-${id}-input`} name="showingSelection"
                                    value={id} 
                                    onChange={ onChangeSelectedShowing(setSelectedShowing) } 
                                />
                                <label htmlFor={`showing-${id}-input`}>{formatDateTime(dateTime)}</label>
                            </div>
                        })
                    }

                    {selectedShowing && <SeatMap showing={showings.filter(({id})=>selectedShowing === id)[0]} onConfirmPurchase={()=>console.log('confirmed purchase')}></SeatMap>}

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

function formatDateTime(dateTime) {
    const date = new Date(dateTime);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month} ${hours}:${minutes} hs`;
}