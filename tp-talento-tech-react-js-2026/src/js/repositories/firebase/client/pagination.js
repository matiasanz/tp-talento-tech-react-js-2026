import {limit, startAfter, orderBy} from "firebase/firestore"

const availableOptions = {
    limit: limit,
    startAfter: startAfter,
    orderBy: orderBy,
}
export class Pagination {
    constructor(args){
        this.args = args
    }

    buildOptions(){
        const options = []
        for(const [key, value] of Object.entries(this.args)){
            const apply = availableOptions[key]
            if(value) {
                options.push(apply(value))
            }
        }

        return options
    }
}