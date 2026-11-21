import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MovieEntry } from '../components/MovieListings'

import paths from "../router/paths"
import { useErrorHandler } from "../context/error_handler"

import { useCart } from "../context/cart"
import { buildShowingItem } from "../../js/domain/cart"

import moviesRepo from "../../js/repositories/movies_read_repo"
import Loading from "../components/Loading"
import showingsRepo from "../../js/repositories/showings_repo"

import { SeatMap } from "../components/SeatMap"

export default () => {
    const {handleError} = useErrorHandler()

    const {productId} = useParams()
    const [movie, setMovie] = useState(null)
    const navigate = useNavigate()
    const cart = useCart()
    const [showings, setShowings] = useState([]) 
    const [selectedShowingId, setSelectedShowingId] = useState(null)

    useEffect(()=>{
        moviesRepo.findById(productId)
            .then(setMovie)
            .catch(handleError)

        showingsRepo.findByMovieId(productId)
            .then(setShowings)
            .catch(handleError)
    
    }, [productId])

    const findShowing = showingId => showings.find(({id})=>showingId === id)
    const onConfirmPurchase = seats=>onClickAddTicketToCart(cart, movie, findShowing(selectedShowingId), seats, navigate)

    return (
        <>
            <Loading isLoaded={movie}>
                <MovieEntry {...movie}/>
            </Loading>

            <Loading isLoaded={showings.length}>
                <form>
                    {
                        showings.map( ({id, dateTime}, index) =>{                            
                            return <div key={`showing-${id}`}>
                                {index!=0 && (<br/>)}

                                <input type="radio"
                                    id={`showing-${id}-input`} name="showingSelection"
                                    value={id} 
                                    onChange={ onChangeSelectedShowing(setSelectedShowingId) } 
                                />
                                <label htmlFor={`showing-${id}-input`}>{formatDateTime(dateTime)}</label>
                            </div>
                        })
                    }

                    {selectedShowingId && <SeatMap showing={findShowing(selectedShowingId)} onConfirmPurchase={onConfirmPurchase}></SeatMap>}
                </form>
            </Loading>
        </>
    )
}

function onClickAddTicketToCart(cart, movie, selectedShowing, seats, navigate){
    cart.addItem(buildShowingItem(movie, selectedShowing, seats))
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