export const withPreventDefault = (onEvent)=> event =>{
    event.preventDefault()
    return onEvent(event)
}

export const onChangeValue = (onChange) => ({target: {value}}) => {
    return onChange(value)
}