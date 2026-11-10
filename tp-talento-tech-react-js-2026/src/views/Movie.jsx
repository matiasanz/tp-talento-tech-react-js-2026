import { useParams } from "react-router-dom"
import MoviesRepo from "../js/repositories/movies_repo"
import { useEffect, useState } from "react"
import {MovieEntry} from '../components/MovieListings'
import { useNavigate } from "react-router-dom"
import paths from "../router/paths"

export default () => {
    const {productId} = useParams()
    const [movie, setMovie] = useState({})
    const navigate = useNavigate()

    useEffect(()=>{
        MoviesRepo.findById(productId)
            .then(setMovie)
            .catch(()=>navigate(paths.NOT_FOUND))
    }, [productId])

    return (
        <>
            <MovieEntry {...movie}/>
            <button>Comprar entrada</button>
        </>
    )

}