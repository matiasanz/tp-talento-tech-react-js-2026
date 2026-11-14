import { db } from './config'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { handleReadError } from './errors';

const identity = x => x

function fromDocument(doc, mapper){
    return mapper({ id: doc.id, ...doc.data() })
}

function fromDocuments(snap, mapper){
    return snap.docs.map(doc => fromDocument(doc, mapper))
}

export class ReadClient {
    constructor(collectionName){
        this.collectionName = collectionName
    }  

    async findById(id, mapper = identity) {
        try {
            const docRef = doc(db, this.collectionName, id);
            const snap = await getDoc(docRef);

            if (!snap.exists()) {
                throw { code: 'not-found', message: `document with Id "${id}" doesn't exist.` };
            }
            
            return fromDocument(snap, mapper);
        } catch (error) {
            handleReadError(error);
        }
    }

    async findAll(mapper = identity) {
        try {
            const colRef = collection(db, this.collectionName);
            const snap = await getDocs(colRef);
            
            return fromDocuments(snap, mapper);
        } catch (error) {
            handleReadError(error);
        }
    }

    async findByQuery(firestoreQuery, mapper=identity) {
        try {
            const snap = await this.getDocs(firestoreQuery);
            return fromDocuments(snap, mapper)
        } catch (error) {
            handleReadError(error);
        }
    }
}
