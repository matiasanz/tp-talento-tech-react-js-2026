import { useEffect, useState, useCallback } from "react"
import { Link } from "react-router-dom"
import paths from "../../../router/paths"
import moviesRepo, {OrderBy_ReleaseDate} from "../../../../js/repositories/movies_read_repo"
import { useErrorHandler } from "../../../context/error_handler"
import Loading from "../../Loading"
import { formatDuration } from "../../../../js/domain/formatters"
import Pagination from "../../Pagination"

export default function MoviesList() { 
    const [movies, setMovies] = useState([])
    const {handleError} = useErrorHandler()
    const [searchValue, setSearchValue] = useState("")
    const [canFetchNext, setCanFetchNext] = useState(true)
    
    const limitPerPage = 1

    const fetchMovies = useCallback((query, lastElement) => {
        const trimmed = query.trim()

        if (trimmed !== "") {
            setCanFetchNext(false)
            moviesRepo.findByText(trimmed)
                .then(setMovies)
                .catch(handleError)
            return
        }
        
        const pagination = {
            limit: limitPerPage + 1,
            orderBy: OrderBy_ReleaseDate,
            startAfter: lastElement?.releaseDate
        }

        moviesRepo.findAll(pagination)
            .then(fetchedMovies => {
                const hasMore = fetchedMovies.length > limitPerPage
                setCanFetchNext(hasMore)
                
                if (hasMore) {
                    fetchedMovies.pop()
                }

                setMovies(prevMovies => 
                    lastElement === null ? fetchedMovies : [...prevMovies, ...fetchedMovies]
                )
            })
            .catch(handleError)
    }, [handleError])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchMovies(searchValue, null)
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [searchValue, fetchMovies])

    return (
        <Loading isLoaded={movies.length > 0 || searchValue !== ""}>
            <form onSubmit={e => e.preventDefault()}>
                <input 
                    type="search"
                    placeholder="Búsqueda..."
                    value={searchValue}
                    onChange={({ target: { value } }) => setSearchValue(value)}
                />
            </form>
            <ul>
                <Pagination
                    alt="Ninguna película coincide con su búsqueda."
                    elements={movies} 
                    onFetchNext={(lastElement) => fetchMovies(searchValue, lastElement)} 
                    canFetchNext={canFetchNext}
                >
                    {m => (
                        <li key={m.id}>
                            <Link to={paths.PRODUCT(m.id)}>
                                <MovieEntry {...m} />
                            </Link>
                        </li>
                    )}        
                </Pagination>
            </ul>
        </Loading>
    )
}

export const MovieEntry = ({title, poster, durationMinutes}) =>
<>
    <h3>{title}</h3>
    <img src={poster} alt={title} />
    <ul>
        <li>duración: {formatDuration(durationMinutes)}</li>
    </ul>
</>
