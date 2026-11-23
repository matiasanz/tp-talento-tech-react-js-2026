import { Link } from "react-router-dom"
import paths from "../../router/paths"
import { ShowingItem } from "../../../js/domain/cart"
import { formatDateTime } from "../../../js/domain/formatters"
import { formatRowLabel } from "./SeatMap/utils"


export default ({canEdit, item, cart, index}) => {
    const {id} = item
    return (
        <li key={id}>
            <h2>Item #{index+1}</h2>
            <ul>
                {
                    item instanceof ShowingItem && (<ShowingItemDetail {...item}/>)
                }
            </ul>
                {
                    canEdit && (
                        <button onClick={()=>onClickDeleteItem(id, cart)}>
                            <img src="/assets/icons/delete.svg"/>
                            Eliminar
                        </button>
                    )
                }
        </li>   
    )
}

const ShowingItemDetail = ({movie, showing, seats}) => (<>
    <li>
        <Link to={paths.PRODUCT(movie.id)}>{movie.title}</Link>    
    </li>
    <li>{formatDateTime(showing.dateTime)} Sala {showing.auditorium.name}</li>
    <li>{seats.length} butaca{seats.length>1?"s":""}: {formatSeats(showing, seats)}</li>
</>)

function onClickDeleteItem(itemId, cart){
    cart.removeItemById(itemId)
}


function formatSeats(showing, seats){
    const s = seats.map(s=>formatSeatLabel(showing, s))
    let suffix = ""
    if(s.length>1){
        const lastSeat = s.pop()
        suffix = " & "+lastSeat
    }

    return s.join(", ")+suffix
}

function formatSeatLabel(showing, seat) {
    const {seatsPerRow} = showing.auditorium
    const row = Math.floor((seat - 1) / seatsPerRow) + 1;
    const column = ((seat - 1) % seatsPerRow) + 1;
    return `${formatRowLabel(row)}-${column}`;
}