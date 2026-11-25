import { WriteClient } from "./client/write_client";

class WriteRepository{
    constructor(){
        this.client = new WriteClient('users')
    }
    async insert(user){
        const mapped = mapUser(user)
        return this.client.insert(user.id, mapped)
            .then(()=>mapped
        )
    }
}

export default new WriteRepository()

// utils
function mapUser({id, role}){
    return {
        id, role
    }
}