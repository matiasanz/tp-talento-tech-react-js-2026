export class Cart {
    constructor(currentItems = [], onChangeItems = ()=>{}) {
        this._items = currentItems
        this.onChangeItems = onChangeItems
    }

    get items(){ return this._items }

    set items(newItems){
        this.onChangeItems(newItems)
    }

    getItem(itemId){
        return this.items.find(item => item.id === itemId)
    }

    addItem(newItem) {
        const existingIndex = this.items.findIndex(({id}) => id === newItem.id)
        if (existingIndex!==-1) {
            this.items[existingIndex] = newItem
        } else {
            this.items.push(newItem)
        }
    }

    removeItemById(itemId) {
        this.items = this.items.filter(({ id }) => id !== itemId);
    }

    clear(){
        this.items = []
    }
}

export class Item {
    constructor(id, detail, quantity) {
        this.id = id;
        this.detail = detail;
        this.quantity = quantity;
    }

}

export class ShowingItemDetail{
    constructor(movie, showing, seats){
        this.movie = movie
        this.showing = showing
        this.seats = seats
    }   
}

export function buildShowingItem(movie, showing, seats){
    return new Item( 
        showing.id,
        new ShowingItemDetail(movie, showing, seats),
         seats.length
    )
}