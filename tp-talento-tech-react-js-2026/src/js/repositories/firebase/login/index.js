import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { AuthResponseDto } from "./dto";
import { FirebaseError } from "firebase/app";
import { auth } from "../client/config";

export async function login(email, password) {
    const userData = await signInWithEmailAndPassword(auth, email, password)
        .then(u => new AuthResponseDto(u))
        .catch(handleError)

    const {isValid, errors} = userData.validate()
    if(!isValid){
        throw new ErrUnprocessableResponse(errors)
    }

    return userData
}

export async function signup(email, password) {
    const userData = await createUserWithEmailAndPassword(auth, email, password)
        .then(u => new AuthResponseDto(u))
        .catch(handleError)

    const {isValid, errors} = userData.validate()
    if(!isValid){
        throw new ErrUnprocessableResponse(errors)
    }

    return userData
}

export async function logout() {
    return signOut(auth)
        .catch(handleError)
}

function handleError(error){
    if(error.name === FirebaseError.name && error.code.startsWith("auth/")){
        const code = error.code.slice(5)
        switch(code){
            case "invalid-credential":
                throw new ErrInvalidCredentials(error)
            case "weak-password":
                throw new ErrWeakPassword(error)
            case "invalid-email":
                throw new ErrInvalidEmail(error)
            case "email-already-in-use":
                throw new ErrEmailAlreadyInUse(error)
        }
    }

    throw new ErrUnexpectedResponse(error)
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

export class ErrWeakPassword extends Error{
    constructor(cause){
        super(cause.message)
    }
}

export class ErrInvalidEmail extends Error{
    constructor(cause){
        super(cause.message)
    }
}

export class ErrUnexpectedResponse extends Error{
    constructor(cause){
        super(cause.message)
    }
}

export class ErrEmailAlreadyInUse extends Error{
    constructor(cause){
        super(cause.message)
    }
}