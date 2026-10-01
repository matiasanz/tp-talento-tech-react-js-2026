export default {
    HOME: "/",
    PRODUCTS: "/products",
    PRODUCT(productId){
        return `${this.PRODUCTS}/${productId}`
    },
    ABOUT: "/about",
}
