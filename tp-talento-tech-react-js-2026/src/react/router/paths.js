export default {
    HOME: "/",
    PRODUCTS: "/products",
    PRODUCT(productId){
        return `${this.PRODUCTS}/${productId}`
    },
    CART: "/cart",
    ABOUT: "/about",
    ADMIN: "/admin",
}
