import { useEffect, useState } from "react"

import { useErrorHandler } from "../context/error_handler"

import Loading from "../components/Loading"
import purchaseRepo from "../../js/repositories/firebase/purchase_read_repo"
import { NotFoundError } from "../../js/repositories/firebase/client/errors"
import Item from "../components/features/Items"
import AuditoriumsRepo from "../../js/repositories/auditoriums_read_repo"
import { Showing } from "../../js/domain/showings"

export default () => {
    const {handleError} = useErrorHandler()
    const {sessionUser, sessionLoaded} = useSessionUser()
    const {purchaseId} = useParams()
    const [purchase, setPurchase] = useState(null)

    useEffect(()=>{
        if(!sessionLoaded){
            return
        }

        if(!sessionUser){
            handleError(new NotFoundError())
            return
        }

        purchaseRepo.findById(purchaseId)
            .then(async(p) => {
                if(p.userId !== sessionUser.id && sessionUser.role !== UserRole.ADMIN){
                    throw new NotFoundError()
                }

                const auditoriums = await AuditoriumsRepo.findAll()
                const auditoriumsById = {}
                auditoriums.forEach(a => {
                    auditoriumsById[a.id] = a
                })

                p.items.forEach(i => {
                    i.showing.auditorium = auditoriumsById[i.showing.auditorium.id]
                    i.showing.movieId = i.movie.id
                    i.showing = new Showing(i.showing)
                })

                return p
            })
            .then(setPurchase)
            .catch(handleError)
            
    }, [sessionUser, sessionLoaded])

    return (
        <>
            <Loading isLoaded={purchase} >
                <>
                    <p>Muestre este enlace al ingresar al establecimiento.</p>
                    { 
                        purchase && purchase.items.map(
                            ((item, index) => Item({canEdit: false, item, index}))
                        )
                    }
                </>
            </Loading>
        </>
    )
}