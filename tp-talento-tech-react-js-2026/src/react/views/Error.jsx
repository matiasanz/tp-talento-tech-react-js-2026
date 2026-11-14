export default ({status}) => {
    const {detail, message, imgSrc} = wellKnownErrors[status] ?? defaultError 
    
    return (
    <>
        <h2>Error {status}: {detail} ❌</h2>
        <p>{message}</p>
        <img src={'/assets/content/errors/'+imgSrc}></img>
    </>
)};


class ErrorData{
    constructor(imgSrc, detail, message){
        this.message = message 
        this.imgSrc = imgSrc
        this.detail = detail
    }
}

const wellKnownErrors = {
    404: new ErrorData("not-found.gif", "Página no encontrada", "El recurso que ud. está buscando no se encuentra disponible."),
    429: new ErrorData("too-many-requests.jfif", "Demasiados pedidos", "En este momento estamos procesando demasiados pedidos. Recargar la página puede empeorar el problema. Intente de nuevo en 15 minutos y disculpe las molestias."),
    408: new ErrorData("gateway-timeout.jpg", "Tiempo de espera agotado", "El servidor tardó demasiado en responder. Pruebe recargar la página y si el error persiste reintente en 15 minutos. Disculpe las molestias.")
}

const defaultError = new ErrorData('internal-server-error.jfif', "", 'Algo malió sal. Pruebe recargar la página y si el error persiste reintente en 15 minutos. Disculpe las molestias.')