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

    const {showing, movie, seats} = i
    showing.dateTime = new Date(showing.dateTime.seconds)
    
    return new ShowingItem(
        movie, showing, seats
    )
}

const mapPurchase = (p) => ({
    items: p.items.map(mapItem),
    userId: p.userId,
    dateTime: p.dateTime
})