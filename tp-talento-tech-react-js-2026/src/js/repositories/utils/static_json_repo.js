class StaticJsonRepo {
    constructor(jsonURL){
        this.jsonURL = jsonURL
    }

    findAll = async() => fetch(this.jsonURL)
        .then(res => res.json())
        .then(json => json.data)

    findMany = async(filter) => {
        const elements = await this.findAll()
            .then(res => res.filter(filter))

        if(!elements.length) {
            throw new Error(`element with id ${elementId} not found`)
        }

        return elements
    }

    findOne = async(filter) => {
        const value = await this.findMany(filter)
        if(value.length === 0){
            throw new Error('element not found')
        } else if(value.length > 1){
            throw new Error('found more than one element')
        }
        
        return value[0]
    }

    findById = async(elementId) => this.findOne(({id}) => id == elementId)
}

export {StaticJsonRepo}