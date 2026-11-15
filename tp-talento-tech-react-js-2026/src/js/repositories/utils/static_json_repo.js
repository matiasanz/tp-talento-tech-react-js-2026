class StaticJsonRepo {
    constructor(jsonURL){
        this.jsonURL = jsonURL
    }

    findAll = async() => fetch(this.jsonURL)
        .then(res => res.json())
        .then(json => json.data)

    findById = async(elementId) => {
        const elements = await this.findAll()
            .then(res => res.filter(({id}) => id == elementId))

        if(!elements.length) {
            throw new Error(`element with id ${elementId} not found`)
        }

        return elements[0]
    }
}

export {StaticJsonRepo}