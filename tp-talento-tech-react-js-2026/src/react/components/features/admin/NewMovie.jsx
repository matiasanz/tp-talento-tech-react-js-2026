import { useState } from "react"
import { MovieDraft } from "../../../../js/domain/movie"
import imagesRepo from "../../../../js/repositories/images_repo"
import moviesRepo from "../../../../js/repositories/movies_write_repo"
import { useNavigate } from "react-router-dom"
import paths from "../../../router/paths"
import { updateAttributes } from "../../utils"

export default () => {
    const [movie, setMovie] = useState(new MovieDraft())

    const navigate = useNavigate()

    const [resultMessage, setResultMessage] = useState('')
    

    const onSubmitForm = event => sendValue(event, movie, setResultMessage, navigate)
    const onChangeInputValue = updateAttributes(setMovie)

    return (
        <>
            <form onSubmit={onSubmitForm}>
                <label htmlFor="title">Título</label>
                <input required
                    placeholder="Título..." 
                    id="title" name="title"
                    type="text" value={movie.title}
                    onChange={onChangeInputValue}
                />

                <label htmlFor="summary">Resumen</label>
                <textarea required
                    placeholder="Había una vez..."
                    id="summary" name="summary"
                    value={movie.summary}
                    onChange={onChangeInputValue}
                />

                <label htmlFor="durationMinutes">Duración</label>
                <input min="00:01"
                    id="durationMinutes" name="durationMinutes"
                    type="time" value={movie.durationMinutes}
                    onChange={onChangeInputValue}
                />

                <label htmlFor="poster">Imagen:</label>
                <input required
                    id="poster" name="poster"
                    type="file" accept="image/*"
                    onChange={updateFile(setMovie)}
                />

                <input type="submit" value="Enviar"/>
            </form>

            <p>{resultMessage}</p>
        </>
    )
}

// utils
function updateFile(setState){
    return async(event) => {
        const {target: {name, files}} = event;
        const result = await imagesRepo.saveImage(files[0])
            
        setState(current => ({
                ...current,
                [name]: result.data.url
            })
        )
    }
}

function sendValue(event, value, setResultMessage, navigate){   
    event.preventDefault()
    moviesRepo.insert(value)
        .then(({id})=>navigate(paths.PRODUCT(id)))
        .catch(err=>setResultMessage('Se produjo un error: '+err.message))
}

