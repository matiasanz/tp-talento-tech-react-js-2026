import { BasicWriteRepo } from "./utils/basic_write_repo";
import { normalizeValueForSearch } from "../utils/search";

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

// utils

function buildSearchValue(fields){
    return fields.map(normalizeValueForSearch).join("|")
}

function parseDuration(durationHHMM){
    var timeParts = durationHHMM.split(":");
    return Number(timeParts[0]) * 60 + Number(timeParts[1]);
}

export default new BasicWriteRepo("movies", {mapper: mapMovie})
