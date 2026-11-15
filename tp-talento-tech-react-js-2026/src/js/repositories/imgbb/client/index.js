import { ImgBBResponseDto } from "./dto"

export class ImgBBClient{
    constructor(key, ttl, domain){
        const url = new URL(domain)
        url.searchParams.append('key', key)
        if(ttl!=0){
            url.searchParams.append("expire", ttl)
        }

        this.url = url
    }

    async uploadFile(imgFile) {
        const formData = new FormData();
        
        formData.append("image", imgFile);

        const response = await fetch(this.url.toString(), {
            method: "POST",
            body: formData,
        })

        const result = await response.json();        

        if (!response.ok || !result.success) {
            if(response.status == 400 && result.error != null && result.error.status === 415){
                throw new UnsupportedMediaTypeError(result.error.message)
            }

            const errorMsg = result.error?.message
            throw new Error(errorMsg);
        }

        return new ImgBBResponseDto(result)
    };
}


// errors
class UnsupportedMediaTypeError extends Error{
    constructor(message){
        super(message)
    }
}