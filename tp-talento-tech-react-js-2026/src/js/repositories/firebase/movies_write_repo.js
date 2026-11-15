import { WriteClient } from "./client/write_client";

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