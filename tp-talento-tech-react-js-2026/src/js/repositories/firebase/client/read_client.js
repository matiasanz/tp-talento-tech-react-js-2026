import { db } from './config'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { handleReadError } from './errors';

export class ReadClient {
    constructor(collectionName){
        this.collectionName = collectionName
    }  

    async findById(id) {
        try {
            const docRef = doc(db, this.collectionName, id);
            const snap = await getDoc(docRef);
            
            if (!snap.exists()) {
                throw { code: 'not-found', message: `document with Id "${id}" doesn't exist.` };
            }
            
            console.log(JSON.stringify(snap))

            return { id: snap.id, ...snap.data() };
        } catch (error) {
            handleReadError(error);
        }
    }

    async findAll() {
        try {
            const colRef = collection(db, this.collectionName);
            const snap = await getDocs(colRef);
            
            return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            handleReadError(error);
        }
    }

    async findByQuery(firestoreQuery) {
        try {
            const snap = await this.getDocs(firestoreQuery);
            return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            handleReadError(error);
        }
    }
}
