import { ReadClient } from "./client/read_client";

class ReadRepository{
    constructor(){
        this.client = new ReadClient('movies')
    }

    async findAll(){
       return this.client.findAll()
    }

    async findById(movieId){
        return this.client.findById(movieId)
    }
}

export default new ReadRepository()