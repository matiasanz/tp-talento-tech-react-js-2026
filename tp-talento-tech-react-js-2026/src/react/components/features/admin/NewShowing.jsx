import { useState } from "react";
import { updateAttributes, withPreventDefault } from "../../utils";
import { useEffect } from "react";
import moviesRepo from "../../../../js/repositories/movies_read_repo";
import { useErrorHandler } from "../../../context/error_handler";
import auditoriumsRepo from "../../../../js/repositories/static_json/auditoriums_read_repo";
import { formatDateTimeToLocalISO } from "../../../../js/domain/formatters";
import showingsRepo from "../../../../js/repositories/showings_write_repo";
import { Showing } from "../../../../js/domain/showings";

export default function NewShowing() {
    const [movies, setMovies] = useState([])
    const [auditoriums, setAuditoriums] = useState([])

    const [showing, setShowing] = useState(new Draft())
    const onChangeInputValue = updateAttributes(setShowing)

    const { handleError } = useErrorHandler()

    useEffect(() => {
        moviesRepo.findAll()
            .then(setMovies)
            .catch(handleError)

        auditoriumsRepo.findAll()
            .then(setAuditoriums)
            .catch(handleError)
    }, [])

    const onSubmit = withPreventDefault(() => {
        const movie = movies.find(a => a.id === showing.movieId)
        if(!movie){
            handleError(new Error("movie not found"))
        }

        
        const auditorium = auditoriums.find(a => a.id == showing.auditoriumId)
        if(!auditorium){
            handleError(new Error("auditorium not found"))
        }

        showingsRepo.insert(
            new Showing({
                dateTime: showing.dateTime,
                movieId: movie.id,
                auditorium,
                soldSeats: []
            }, {skipId: true})
        ).then(()=>{
            setShowing(new Draft())
        })
    })

    return (
        <form onSubmit={onSubmit}>
            
            <label htmlFor="movieId">Película</label>
            <select required
                id="movieId" name="movieId"
                value={showing.movieId}
                onChange={onChangeInputValue}
            >
            <option hidden value="">Selecciona una película...</option>
                {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                        {movie.title}
                    </option>
                ))}
            </select>
        
            <label htmlFor="auditoriumId">Sala</label>
            <select required
                id="auditoriumId" name="auditoriumId"
                value={showing.auditoriumId}
                onChange={onChangeInputValue}
            >
                <option hidden value="">Selecciona una sala...</option>
                {auditoriums.map((auditorium) => (
                    <option key={auditorium.id} value={auditorium.id}>
                        {auditorium.name}
                    </option>
                ))}
            </select>
            <label htmlFor="dateTime">Fecha</label>
            <input required
                id="dateTime" name="dateTime"
                type="datetime-local"
                value={showing.dateTime}
                onChange={onChangeInputValue}
            />
        
            <button type="submit">Crear Función</button>
        </form>
    );
}

class Draft {
    constructor(movieId = "", auditoriumId = "", dateTime = "") {
        this.movieId = movieId;
        this.auditoriumId = auditoriumId;
        this.dateTime = dateTime;
    }
}
