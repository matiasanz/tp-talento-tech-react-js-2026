export const withPreventDefault = (onEvent)=> event =>{
    event.preventDefault()
    return onEvent(event)
}

export const onChangeValue = (onChange) => ({target: {value}}) => {
    return onChange(value)
}

export const updateAttributes = (setState) => ({target: {name, value}}) => {
    setState((current) => ({
        ...current,
        [name]: value
    }));
}
