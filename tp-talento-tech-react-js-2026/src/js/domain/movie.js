export class MovieEntry {
    constructor(id, title, durationMinutes, poster){
        this.id = id
        this.title = title
        this.poster = poster
        this.durationMinutes = durationMinutes
    }
}

export class Movie extends MovieEntry{
    constructor(id, title, durationMinutes, poster, searchValue){
        super(id, title, durationMinutes, poster)
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