import { useState } from "react"
import { MovieDraft } from "../../../js/domain/movie"

export default () => {
    const [movie, setMovie] = useState(new MovieDraft())
    const [resultMessage, setResultMessage] = useState('')

    const onSubmitForm = event => sendValue(event, {setMovie, setResultMessage})
    const onChangeInputValue = updateValue(setMovie)

    return (
        <>
            <form onSubmit={onSubmitForm}>
                <label htmlFor="title">Título</label>
                <input
                    required
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Título"
                    value={movie.title}
                    onChange={onChangeInputValue}
                />

                <label htmlFor="summary">Resumen</label>
                <textarea
                    required
                    id="summary"
                    name="summary"
                    placeholder="Resumen"
                    value={movie.summary}
                    onChange={onChangeInputValue}
                />

                <label htmlFor="durationMinutes">Duración</label>
                <input
                    min="00:01"
                    id="durationMinutes"
                    name="durationMinutes"
                    type="time"
                    value={movie.durationMinutes}
                    onChange={onChangeInputValue}
                />
                <input type="submit" value="Enviar"/>
            </form>

            <p>{resultMessage}</p>
        </>
    )
}

// utils
function updateValue(setState){
    return (event) => {
        const {target: {name, value}} = event;

        setState((current) => ({
            ...current,
            [name]: value
        }));
    }
}

function sendValue(event, state){
    event.preventDefault()
    state.setMovie(new MovieDraft())
    state.setResultMessage('Su película se ha sido recibida e ignorada con éxito')
}

