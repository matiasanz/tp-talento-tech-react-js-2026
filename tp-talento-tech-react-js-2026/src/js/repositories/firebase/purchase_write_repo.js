import { WriteClient } from "./client/write_client";

import { ShowingItem } from "../../domain/cart"

class WriteRepository{
    constructor(){
        this.client = new WriteClient('purchases')
    }

    async insert(purchase){
        const id = crypto.randomUUID()
        const mapped = mapPurchase(purchase)
        return this.client.insert(id, mapped)
            .then(()=>({
                ...mapped,
                id
            })
        )
    }
}

export default new WriteRepository()

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