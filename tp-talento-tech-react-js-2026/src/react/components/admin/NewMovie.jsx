export default () => {
    
    
    return (
        <>        
            <form>
                <label for="title">Título</label>
                <input id="title" type="text" placeholder="Título"></input>      

                <label for="summary">Resumen</label>
                <textarea id="summary" placeholder="Resumen"></textarea>      

                <label for="duration">Duración</label>
                <input id="duration" type="time" placeholder="Duración"></input>      
            </form>
        </>
    )
}