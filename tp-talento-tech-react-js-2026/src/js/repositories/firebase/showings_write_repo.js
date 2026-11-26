import { Showing } from "../../domain/showings";
import { BasicWriteRepo } from "./utils/basic_write_repo";

export default new BasicWriteRepo("showings", {mapper})

// mappers
function mapper(showing) {
    if (!(showing instanceof Showing)) {
        throw new Error('Expected an instance of Showing.');
    }

    return {
        dateTime: showing.dateTime,
        movieId: showing.movieId,
        soldSeats: showing.soldSeats,
        auditorium: mapAuditorium(showing.auditorium) 
    };
}

const mapAuditorium = auditorium => ({
    id: auditorium.id,
    name: auditorium.name,
    rowsLayout: [...auditorium.rowsLayout],
    rowsCount: auditorium.rowsCount
})