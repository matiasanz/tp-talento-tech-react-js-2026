import { useEffect, useState } from "react"

import { useErrorHandler } from "../context/error_handler"

import Loading from "../components/Loading"
import purchaseRepo from "../../js/repositories/firebase/purchase_read_repo"
import { NotFoundError } from "../../js/repositories/firebase/client/errors"
import Item from "../components/features/Items"
import AuditoriumsRepo from "../../js/repositories/auditoriums_read_repo"
import { Showing } from "../../js/domain/showings"
import { useSessionUser } from "../context/session"
import { useParams } from "react-router-dom"
import { UserRole } from "../../js/domain/users"

export default () => {
    const {handleError} = useErrorHandler()
    const { user } = useSessionUser()
    const {purchaseId} = useParams()
    const [purchase, setPurchase] = useState(null)

    useEffect(()=>{
        if(!user.isLoaded || !user.role){
            return
        }

        purchaseRepo.findById(purchaseId)
            .then(async(p) => {
                if(p.userId !== user.id && user.role !== UserRole.ADMIN){
                    throw new NotFoundError()
                }

                const auditoriumsById = await AuditoriumsRepo.findManyById(p.items.map(getAuditoriumId))

                p.items.forEach(item => {
                    const showing = item.showing 
                    showing.auditorium = auditoriumsById.get(getAuditoriumId(item))
                    showing.movieId = item.movie.id
                    item.showing = new Showing(showing)
                })

                return p
            })
            .then(setPurchase)
            .catch(handleError)
            
    }, [user.isLoaded, user.exists, user.role])

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

const getAuditoriumId = item => item.showing.auditorium.id