import { WriteClient } from "../client/write_client";

export class BasicWriteRepo{
    constructor(collectionName, {mapper = ()=>{}}){
        this._client = new WriteClient(collectionName)
        this._mapper = mapper
    }

    async insert(element){
        const id = crypto.randomUUID()
        const mapped = this._mapper(element)

        return this._client.insert(id, mapped)
            .then(()=>({
                ...mapped,
                id
            })
        )
    }
}