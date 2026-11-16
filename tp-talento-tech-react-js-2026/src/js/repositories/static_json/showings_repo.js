import {StaticJsonRepo} from './client/static_json_repo' 

class ShowingRepo extends StaticJsonRepo{
    constructor(){
        super('/api/showings.json')
    }

    async findByMovieId(productId){
        return this.findMany(({movieId})=>movieId === productId)
    }
}

export default new ShowingRepo()


