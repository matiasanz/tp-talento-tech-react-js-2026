import { ReadClient } from "./client/read_client";
import { Showing } from "../../domain/showings";
import { query, where } from "firebase/firestore";

class ReadRepository{
    constructor(){
        this.client = new ReadClient('showings')
    }

      async findByMovieId(productId){
          return this.client.findByQuery(collection => query(
              collection, where("movieId", "==", productId)
          ), s => {
              return new Showing(s)
          })
      }
}

export const OrderBy_ReleaseDate = "releaseDate"

export default new ReadRepository()