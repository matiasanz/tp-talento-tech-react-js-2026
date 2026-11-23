export default {
    HOME: "/",
    PRODUCTS: "/products",
    PRODUCT(productId){
        return `${this.PRODUCTS}/${productId}`
    },
    CART: "/cart",
    PURCHASE(purchaseId){
        return `/purchases/${purchaseId}`
    },
    ABOUT: "/about",
    ADMIN: "/admin",
}
