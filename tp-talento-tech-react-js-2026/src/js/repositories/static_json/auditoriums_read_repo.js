import {StaticJsonRepo} from './client/static_json_repo' 

class ReadRepo extends StaticJsonRepo {
    constructor(filename){
        super(filename)
    }

    async findManyById(ids){
        const elements = await this.findAll()


        const elementsIndexed = new Map(elements.map(v => [v.id, v]))

        console.log(JSON.stringify(elementsIndexed, null, 2))


        const matches = new Map()
        for(const elementId of ids){
            matches.set(elementId, elementsIndexed.get(elementId))
        }

        return matches
    }
}

export default new ReadRepo('/api/auditoriums.json')