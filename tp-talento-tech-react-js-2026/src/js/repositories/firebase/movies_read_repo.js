import { ReadClient } from "./client/read_client";
import { Movie, MovieEntry } from "../../domain/movie";
import { normalizeValueForSearch } from "../utils/search";

const mapMovieEntry = m => new MovieEntry(m.id, m.title, m.durationMinutes, m.poster, m.releaseDate)

const mapMovie = m => new Movie(m.id, m.title, m.durationMinutes, m.poster, m.releaseDate, m.searchValue)

class ReadRepository{
    constructor(){
        this.client = new ReadClient('movies')
    }

    async findAll(pagination = null, mapper = mapMovieEntry){
       return this.client.findAll({mapper, pagination})
    }

    async findById(movieId){
        return this.client.findById( movieId, mapMovie)
    }

    async findByText(text){
        const movies = await this.findAll(null, mapMovie)
        const normalizedText = normalizeValueForSearch(text)
        const normalizedTextWords = (text.split(" ").map(normalizeValueForSearch))

        return movies.filter( ({searchValue}) =>
            searchValue.includes(normalizedText) || normalizedTextWords.every(w => searchValue.includes(w))
        ).map(mapMovieEntry)
    }
}

export const OrderBy_ReleaseDate = "releaseDate"

export default new ReadRepository()