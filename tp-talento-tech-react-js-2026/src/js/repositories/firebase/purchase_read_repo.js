import { ShowingItem } from "../../domain/cart"
import { ReadClient } from "./client/read_client"

class ReadRepository{
    constructor(){
        this.client = new ReadClient('purchases')
    }

    async findById(purchaseId){
        return this.client.findById(purchaseId, mapPurchase)
    }
}

export default new ReadRepository()

// mappers
const mapItem = i => {
    if(!i instanceof ShowingItem){
        return i
    }

    const {showing, movie} = i

    return {
        showing: {
            id: showing.id,
            dateTime: showing.dateTime,
            auditorium: {
                id: showing.auditorium.id,
                name: showing.auditorium.name,
            }
        },

        seats: i.seats,

        movie: {
            id: movie.id,
            title: movie.title
        }
    }
}

const mapPurchase = (p, dateTime = new Date()) => ({
    items: p.items.map(mapItem),
    userId: p.userId,
    dateTime: dateTime
})