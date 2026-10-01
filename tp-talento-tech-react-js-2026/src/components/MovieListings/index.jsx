import { useEffect, useState } from "react"

export default () =>  { 
    const [movies, setMovies] = useState([])

    useEffect(()=>{
        fetch('/api/movies.json')
            .then(res => res.json())
            .then(json => json.data)
            .then(setMovies)
            .catch(console.error)
    }, [])
    
    return (<>
        <ul>
            {movies.map(m => 
                <li key={m.id}>
                {Movie(m)}
                </li>
            )}
        </ul>
    </>)
}

const Movie = (movie) =>
<>
    <h3>{movie.title}</h3>
    <img src="/placeholders/movie-poster.jpg"></img>
    <ul>
        <li>duration: {durationToString(movie.durationMinutes)}</li>
    </ul>
</> 
    

//utils

function durationToString(durationMinutes){
    const hours = Math.floor(durationMinutes/60).toString().padStart(2, '0')
    const minutes = (durationMinutes%60).toString().padStart(2, '0')

    return `${hours} Hs ${minutes} m`
}
