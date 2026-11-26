import { useState } from "react";
import { updateAttributes, withPreventDefault } from "../../utils";
import { useEffect } from "react";
import moviesRepo from "../../../../js/repositories/movies_read_repo";
import { useErrorHandler } from "../../../context/error_handler";

export default function NewShowing() {
    const auditoriums = [{ id: 1, name: "Sala Negra" }];
    const [movies, setMovies] = useState([]);

    const [showing, setShowing] = useState(new Draft());
    const onChangeInputValue = updateAttributes(setShowing);

    const { handleError } = useErrorHandler()

    useEffect(() => {
        moviesRepo.findAll()
            .then(setMovies)
            .catch(handleError)
    }, [])

    const onSubmit = withPreventDefault(() => {
        alert(JSON.stringify(showing, null, 2))
    })


    return (
        <form onSubmit={onSubmit}>
            
            <label htmlFor="movieId">Película</label>
            <select required
                id="movieId" name="movieId"
                value={showing.movieId}
                onChange={onChangeInputValue}
            >
            <option value="">Selecciona una película...</option>
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
                <option value="">Selecciona una sala...</option>
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
