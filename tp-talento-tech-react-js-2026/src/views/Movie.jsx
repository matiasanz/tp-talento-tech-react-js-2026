import { useParams } from "react-router-dom"
import { findById } from "../js/repository"
import { useEffect, useState } from "react"
import {MovieEntry} from '../components/MovieListings'

export default () => {
    const {productId} = useParams()

    const [movie, setMovie] = useState({})

    useEffect(()=>{
        findById(productId).then(d => {
            console.log(JSON.stringify(d))
            return d
        }).then(setMovie)
    }, [productId])

    return (
        <>
            <MovieEntry {...movie}/>
            <button>Comprar entrada</button>
        </>
    )

}