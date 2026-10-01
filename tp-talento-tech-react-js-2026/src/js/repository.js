export const findAll = async() => fetch('/api/movies.json')
    .then(res => res.json())
    .then(json => json.data)


export const findById = async(movieId) => {
    const movies = await findAll()
        .then(res => res.filter(({id}) => id == movieId))

    if(!movies.length) {
        throw new Error(`movie with id ${movieId} not found`)
    }

    return movies[0]
}