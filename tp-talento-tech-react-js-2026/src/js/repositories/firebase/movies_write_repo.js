import { WriteClient } from "./client/write_client";
import { normalizeValueForSearch } from "../utils/search";

function parseDuration(durationHHMM){
    var timeParts = durationHHMM.split(":");
    return Number(timeParts[0]) * 60 + Number(timeParts[1]);
}

const mapMovie = m => {
    if (m.poster == null) {
        console.error(new Error(JSON.stringify(m, null, 2)))
    }

    return {
        ...m,
        searchValue: buildSearchValue([m.title]), 
        durationMinutes: parseDuration(m.durationMinutes)
    }
}

class WriteRepository{
    constructor(){
        this.client = new WriteClient('movies')
    }

    
    async insert(movie){
        const id = crypto.randomUUID()
        const mapped = mapMovie(movie)
        return this.client.insert(id, mapped)
            .then(()=>({
                ...mapped,
                id
            })
        )
    }
}

export default new WriteRepository()

// utils

function buildSearchValue(fields){
    return fields.map(normalizeValueForSearch).join("|")
}