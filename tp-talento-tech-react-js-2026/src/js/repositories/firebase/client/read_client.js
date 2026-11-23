import { db } from './config'
import { doc, getDoc, collection, getDocs, query } from 'firebase/firestore';
import { handleReadError } from './errors';
import { Pagination } from './pagination';

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

    async findAll({mapper = identity, pagination = null}) {
        try {
            const colRef = collection(db, this.collectionName);

            const snap = await (
                pagination?
                  getDocs(query(colRef, ...new Pagination(pagination).buildOptions()))
                : getDocs(colRef)
            )

            return fromDocuments(snap, mapper);
        } catch (error) {
            handleReadError(error);
        }
    }

    async findByQuery(firestoreQuery, mapper=identity) {
        try {
            const snap = await getDocs(firestoreQuery);
            return fromDocuments(snap, mapper)
        } catch (error) {
            handleReadError(error);
        }
    }
}