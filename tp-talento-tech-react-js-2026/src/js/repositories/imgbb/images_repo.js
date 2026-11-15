import { ImgBBClient } from "./client"

const env = import.meta.env

export default {
    client: new ImgBBClient(env.VITE_IMGBB_API_KEY, env.VITE_IMGBB_API_EXPIRATION, env.VITE_IMGBB_URL),

    async saveImage(imgFile){
        return this.client.uploadFile(imgFile)
    }
}