import { WriteClient } from "./client/write_client";
import { arrayUnion } from "firebase/firestore";

class UpdateRepo{
    constructor(){
        this.client = new WriteClient("showings")
    }
    async updateAvailability(showing, seats){
        return this.client.update(showing, {
            soldSeats: arrayUnion(...seats)
        })
    }
}

export default new UpdateRepo()