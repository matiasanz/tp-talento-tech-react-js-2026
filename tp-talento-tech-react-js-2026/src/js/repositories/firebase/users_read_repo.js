import { ReadClient } from "./client/read_client";

class WriteRepository{
    constructor(){
        this.readClient = new ReadClient('users')
    }

    async findById(userId, {onSnaphot = false}){
        if(onSnaphot){
            return this.readClient.findByIdOnSnapshot(userId, mapUser)
        }

        return this.readClient.findById(userId, mapUser)
    }
}

export default new WriteRepository()

// utils
function mapUser({id, role}){
    return {
        id, role
    }
}