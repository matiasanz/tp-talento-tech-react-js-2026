import { apiClient } from "./client/config"

class Repository {
    constructor(client){
        this.client = client
    }

    async saveImage(imgFile){
        return this.client.uploadFile(imgFile)
    }
}

export default new Repository(apiClient)