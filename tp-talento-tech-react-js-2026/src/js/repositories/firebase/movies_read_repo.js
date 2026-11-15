import { ReadClient } from "./client/read_client";
import { Movie, MovieEntry } from "../../domain/movie";

const mapMovieEntry = m => new MovieEntry(m.id, m.title, m.durationMinutes, m.poster)

const mapMovie = m => {
    return new Movie(m.id, m.title, m.durationMinutes, m.poster)
}

class ReadRepository{
    constructor(){
        this.client = new ReadClient('movies')
    }

    async findAll(){
       return this.client.findAll(mapMovieEntry)
    }

    async findById(movieId){
        return this.client.findById( movieId, mapMovie)
    }
}

export default new ReadRepository()