export default {
    HOME: "/",
    PRODUCTS: "/products",
    PRODUCT(productId){
        return `${this.PRODUCTS}/${productId}`
    },
    ABOUT: "/about",
    NOT_FOUND: "/not-found"
}
