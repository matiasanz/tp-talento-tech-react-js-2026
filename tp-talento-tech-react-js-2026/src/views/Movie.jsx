import { useParams } from "react-router-dom"
import MoviesRepo from "../js/repositories/movies_repo"
import { useEffect, useState } from "react"
import {MovieEntry} from '../components/MovieListings'

export default () => {
    const {productId} = useParams()

    const [movie, setMovie] = useState({})

    useEffect(()=>{
        MoviesRepo.findById(productId)
            .then(setMovie)
    }, [productId])

    return (
        <>
            <MovieEntry {...movie}/>
            <button>Comprar entrada</button>
        </>
    )

}