import { useEffect, useState } from "react"
import { withPreventDefault } from "./utils"

export default ({onFetchNext, canFetchNext, elements, alt, children}) => {
    const [lastElement, setLastElement] = useState(null)
    const [enabledButton, setEnabledButton] = useState(canFetchNext) 

    useEffect(()=>{
        const elementsSize = elements.length
        if(elementsSize>0){
            setLastElement(elements[elementsSize-1])
            setEnabledButton(canFetchNext)
        }
    }, [elements.length])

    const onClickShowMore = withPreventDefault(()=>{        
        onFetchNext(lastElement)
    })

    return elements.length? (
        <>
            <div>
                { elements.map((e, index) => (<div key={e.id ?? index}>{children(e)}</div>)) }
            </div>
            {
                canFetchNext && (
                    <div>
                        <button onClick={onClickShowMore}>Mostrar más</button>
                    </div>
                )
            }
        </>
    ): {alt}
}