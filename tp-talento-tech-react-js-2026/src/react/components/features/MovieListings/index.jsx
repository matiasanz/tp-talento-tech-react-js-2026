import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import paths from "../../../router/paths"
import moviesRepo, {OrderBy_ReleaseDate} from "../../../../js/repositories/movies_read_repo"
import { useErrorHandler } from "../../../context/error_handler"
import Loading from "../../Loading"
import { formatDuration } from "../../../../js/domain/formatters"
import Pagination from "../../Pagination"

export default () =>  { 
    const [movies, setMovies] = useState([])
    const {handleError} = useErrorHandler()
    const [searchValue, setSearchValue] = useState("")
    const [canFetchNext, setCanFetchNext] = useState(true)
    let searching = false
    
    const limitPerPage = 1

    const onFetchNext = searchValue => async(lastElement) => {
        if (searchValue!== ""){
            moviesRepo.findByText(searchValue)
            .then(m=>{
                if(!searching){
                    searching = true
                }
                
                return m
            })
            .then(setMovies)
            .catch(handleError)

            return
        }
        
        const pagination = {
            limit: limitPerPage+1,
            orderBy: OrderBy_ReleaseDate
        }

        if(lastElement!==null){
            pagination.startAfter = lastElement.releaseDate
        }

        moviesRepo.findAll(pagination)
        .then(m => {
            const moreMovies = m.length>limitPerPage
            setCanFetchNext(moreMovies)
            if(moreMovies){
                m.pop()
            }

            if(!searching){
                m = [...movies, ...m]

            } else {
                searching = false
            }

            setMovies(m)
        })
        .catch(handleError)
    }

    useEffect(()=>{
        onFetchNext(searchValue)(null)
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
                <Pagination
                    alt={"Ninguna película coincide con su búsqueda."}   
                    elements={movies} 
                    onFetchNext={onFetchNext(searchValue)} 
                    canFetchNext={canFetchNext}
                >
                    {
                        m => (
                            <Link to={paths.PRODUCT(m.id)}>
                                <li>
                                    {MovieEntry(m)}
                                </li>
                            </Link>
                        )
                    }        
                </Pagination>
            </ul>
        </Loading>
    </>)
}

export const MovieEntry = ({title, poster, durationMinutes}) =>
<>
    <h3>{title}</h3>
    <img src={poster}></img>
    <ul>
        <li>duración: {formatDuration(durationMinutes)}</li>
    </ul>
</> 