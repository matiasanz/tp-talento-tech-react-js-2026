export class MovieEntry {
    constructor(id, title, durationMinutes, poster, releaseDate){
        this.id = id
        this.title = title
        this.poster = poster
        this.durationMinutes = durationMinutes
        this.releaseDate = releaseDate
    }
}

export class Movie extends MovieEntry{
    constructor(id, title, durationMinutes, poster, releaseDate, searchValue){
        super(id, title, durationMinutes, poster, releaseDate)
        this.searchValue = searchValue
    }
}

export class MovieDraft {
    constructor(){
        this.title = ''
        this.poster = ''
        this.summary = ''
        this.durationMinutes = '00:00'
    }
}