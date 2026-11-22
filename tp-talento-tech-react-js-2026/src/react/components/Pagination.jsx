import { useEffect } from "react"
import { useState } from "react"
import { withPreventDefault } from "./utils"

export default ({onChangePageNumber, lastPageNumber, elements, alt, children}) => {
    const [pageNumber, setPageNumber] = useState(1)
 
    useEffect(()=>{
        onChangePageNumber(pageNumber)
    }, [pageNumber])

    const previousPage = withPreventDefault(()=>setPageNumber(Math.max(pageNumber-1, 1)))
    const nextPage = withPreventDefault(()=>setPageNumber(Math.min(pageNumber+1, lastPageNumber)))

    return elements.length? (
        <>
            <div>
                { elements.map((e, index) => (<div key={e.id ?? index}>{children(e)}</div>)) }
            </div>
            <div>
                { pageNumber > 1 && <button onClick={previousPage}>Anterior</button> }
                {pageNumber}
                { pageNumber < lastPageNumber && <button onClick={nextPage}>Siguiente</button> }
            </div>
        </>
    ): {alt}
}