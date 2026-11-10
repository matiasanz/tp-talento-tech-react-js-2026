import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import paths from "../../router/paths"
import moviesRepo from "../../js/repositories/movies_repo"

export default () =>  { 
    const [movies, setMovies] = useState([])

    useEffect(()=>{
        moviesRepo.findAll()
            .then(setMovies)
            .catch(console.error)
    }, [])
    
    return (<>
        <ul>
            {movies.map(m => 
                <Link to={paths.PRODUCT(m.id)} key={m.id}>
                    <li>
                        {MovieEntry(m)}
                    </li>
                </Link>
                
            )}
        </ul>
    </>)
}

export const MovieEntry = (movie) =>
<>
    <h3>{movie.title}</h3>
    <img src={movie.poster}></img>
    <ul>
        <li>duración: {durationToString(movie.durationMinutes)}</li>
    </ul>
</> 
    

//utils

function durationToString(durationMinutes){
    const hours = Math.floor(durationMinutes/60).toString().padStart(2, '0')
    const minutes = (durationMinutes%60).toString().padStart(2, '0')

    return `${hours} Hs ${minutes} m`
}
