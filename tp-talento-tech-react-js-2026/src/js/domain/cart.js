export class Cart {
    constructor(currentItems = []) {
        this.items = currentItems;
    }

    addItem(newItem) {
        const existingItem = this.items.find(item => item.id === newItem.id);

        if (existingItem) {
            existingItem.quantity += newItem.quantity;
        } else {
            this.items.push(newItem);
        }
    }

    removeItemById(itemId) {
        this.items = this.items.filter(({ id }) => id !== itemId);
    }
}

export class Item {
    constructor(id, detail, quantity) {
        this.id = id;
        this.detail = detail;
        this.quantity = quantity;
    }
}