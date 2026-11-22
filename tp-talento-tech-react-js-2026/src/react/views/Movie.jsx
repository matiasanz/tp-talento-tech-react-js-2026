import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MovieEntry } from '../components/MovieListings'

import paths from "../router/paths"
import { useErrorHandler } from "../context/error_handler"

import { useCart } from "../context/cart"
import { ShowingItem } from "../../js/domain/cart"

import { SeatMap } from "../components/SeatMap"
import Loading from "../components/Loading"

import moviesRepo from "../../js/repositories/movies_read_repo"
import showingsRepo from "../../js/repositories/showings_repo"

import { formatDateTime } from "../../js/domain/formatters"

export default () => {
    const {handleError} = useErrorHandler()
    
    const {productId} = useParams()
    const [movie, setMovie] = useState(null)

    const [showings, setShowings] = useState([]) 


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
            <Loading isLoaded={movie} >
                <MovieEntry {...movie}/>
                <BuyTicketsForm movie={movie} showings={showings}/>
            </Loading>
        </>
    )
}

function BuyTicketsForm({movie, showings}){
    const [selectedShowingId, setSelectedShowingId] = useState(null)
    const navigate = useNavigate()
    const cart = useCart()

    const findShowing = showingId => showings.find(({id})=>showingId === id)
    const onConfirmPurchase = seats=>onClickAddTicketToCart(cart, movie, findShowing(selectedShowingId), seats, navigate)
    const previousSelectedSeats = showingId => cart.getItem(showingId)?.seats ?? []

    return ( showings.length?(
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

                {selectedShowingId && <SeatMap showing={findShowing(selectedShowingId)} previousSelectedSeats={previousSelectedSeats(selectedShowingId)} onConfirmPurchase={onConfirmPurchase}></SeatMap>}
            </form>
        ): <p>Actualmente no hay funciones disponibles para esta película.</p>
    )
}

function onClickAddTicketToCart(cart, movie, selectedShowing, seats, navigate){
    cart.addItem(new ShowingItem(movie, selectedShowing, seats))
    navigate(paths.CART)
}

const onChangeSelectedShowing = (setSelectedShowing) => ({target: {value}}) => {
    setSelectedShowing(value)
}