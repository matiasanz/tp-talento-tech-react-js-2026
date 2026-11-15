import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthResponseDto } from "./dto";
import { FirebaseError } from "firebase/app";
import { auth } from "../client/config";

export default async(email, password) => {
    const userData = await signInWithEmailAndPassword(auth, email, password)
        .then(u => new AuthResponseDto(u))
        .catch(handleError)

    const {isValid, errors} = userData.validate()
    if(!isValid){
        throw new ErrUnprocessableResponse(errors)
    }

    return userData
}

function handleError(error){
    if(error.name === FirebaseError.name && error.code ==="auth/invalid-credential"){
        throw new ErrInvalidCredentials()
    }

    throw new ErrUnexpectedResponse(err)
}


// errors

export class ErrInvalidCredentials extends Error{
    constructor(){
        super()
    }
}

export class ErrUnprocessableResponse extends Error{
    constructor(validations){
        super('errors: '+ validations)
        this.validations = validations
    }
}

export class ErrUnexpectedResponse extends Error{
    constructor(cause){
        super(cause.message)
    }
}