const movies = [
    {
        id: 1,
        poster: "not_found.jpg",
        title: "Toy story 25",
        durationMinutes: 255,
        categories: ["ANIMATED"],        
        projectionFormats: ["3D", "2D"],
        languageFormats: ["ENG", "DUB", "SUBS"]
    }
]

const Movie = (movie) =>
<>
    <h3>{movie.title}</h3>
    <img src="/placeholders/movie-poster.jpg"></img>
    <ul>
        <li>duration: {durationToString(movie.durationMinutes)}</li>
    </ul>
</> 
    

export default () =>   
<>
    <ul>
        {movies.map(m => 
            <li key={m.id}>
              {Movie(m)}
            </li>
        )}
    </ul>
</>

//utils

function durationToString(durationMinutes){
    const hours = Math.floor(durationMinutes/60).toString().padStart(2, '0')
    const minutes = (durationMinutes%60).toString().padStart(2, '0')

    return `${hours} Hs ${minutes} m`
}