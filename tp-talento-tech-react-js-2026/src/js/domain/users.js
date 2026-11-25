export class User{
    constructor({uid, email}){
        this.id = uid
        this.email = email
    }
}

export const UserRole = {
    CLIENT: "CLIENT",
    ADMIN: "ADMIN"
}