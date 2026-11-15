export class Cart {
    constructor(currentItems = [], onChangeItems = ()=>{}) {
        this._items = currentItems
        this.onChangeItems = onChangeItems
    }

    get items(){ return this._items }

    set items(newItems){
        this.onChangeItems(newItems)
    }

    addItem(newItem) {
        const existingItem = this.items.find(item => item.id === newItem.id);

        if (existingItem) {
            existingItem.quantity += newItem.quantity;
        } else {
            this.items = [...this.items, newItem]
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