import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import paths from "../../router/paths"
import moviesRepo from "../../../js/repositories/movies_read_repo"
import { useErrorHandler } from "../../context/error_handler"
import Loading from "../Loading"

export default () =>  { 
    const [movies, setMovies] = useState([])
    const {handleError} = useErrorHandler()
    const [searchValue, setSearchValue] = useState("")

    useEffect(()=>{
        if(searchValue === ""){
            moviesRepo.findAll()
                .then(setMovies)
                .catch(handleError)
            return
        }

        moviesRepo.findByText(searchValue)
            .then(setMovies)
            .catch(handleError)

    }, [searchValue])
    
    return (<>
        <Loading isLoaded={movies.length || searchValue !== ""}>
            <form>
                <input type="search"
                    placeholder="Búsqueda..."
                    value={searchValue}
                    onChange={({target: {value}})=>setSearchValue(value)}
                />
            </form>
            <ul>
                {movies.length? movies.map(m => 
                    <Link to={paths.PRODUCT(m.id)} key={m.id}>
                        <li>
                            {MovieEntry(m)}
                        </li>
                    </Link>        
                ): <p>Ninguna película coincide con su búsqueda.</p>}
            </ul>
        </Loading>
    </>)
}

export const MovieEntry = ({title, poster, durationMinutes}) =>
<>
    <h3>{title}</h3>
    <img src={poster}></img>
    <ul>
        <li>duración: {durationToString(durationMinutes)}</li>
    </ul>
</> 
    

//utils

function durationToString(durationMinutes){
    const hours = Math.floor(durationMinutes/60).toString()
    const minutes = (durationMinutes%60).toString().padStart(2, '0')

    return `${hours} ${hours==1? 'h': 'hs'} ${minutes} m`
}
