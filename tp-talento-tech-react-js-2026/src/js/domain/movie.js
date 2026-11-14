export class MovieEntry {
    constructor(id, title, durationMinutes, poster){
        this.id = id
        this.title = title
        this.poster = poster
        this.durationMinutes = durationMinutes
    }
}

export class Movie extends MovieEntry{
    constructor(id, title, durationMinutes, poster){
        super(id, title, durationMinutes, poster)
    }
}
