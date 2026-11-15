import { ImgBBClient } from "./"

const env = import.meta.env

export const apiClient = new ImgBBClient(env.VITE_IMGBB_API_KEY, env.VITE_IMGBB_API_EXPIRATION, env.VITE_IMGBB_URL)
