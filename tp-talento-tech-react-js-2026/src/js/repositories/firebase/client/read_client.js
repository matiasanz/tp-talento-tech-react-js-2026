import { db } from './config'
import { doc, getDoc, collection, getDocs, query, onSnapshot } from 'firebase/firestore';
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

    async findByIdOnSnapshot(id, mapper=identity, maxRetries = 10, timeoutMs = 3000){
        let retry = 1
        let timer = null

        const docRef = doc(db, this.collectionName, id);
        try {
            const data = await new Promise((resolve, reject ) => {
                timer = setTimeout(() => {
                    unsubscribe?.();
                    reject({ 
                        code: 'timeout', 
                        message: `Document with Id "${id}" wasn't found after ${timeoutMs}ms.` 
                    });
                }, timeoutMs);

                let unsubscribe = null
                
                unsubscribe = onSnapshot(docRef, snap => {
                    if (!snap.exists()) {
                        if (retry++>=maxRetries){
                            unsubscribe?.()
                            clearTimeout(timer)
                            reject({ code: 'not-found', message: `document with Id "${id}" doesn't exist after ${maxRetries} retries.` })
                            return
                        }
    
                        return
                    }               
                
                    clearTimeout(timer)
                    unsubscribe?.()
                    resolve(snap)
                })
            }) 
            
            return fromDocument(data, mapper);
        } catch (error) {
            handleReadError(error);
        } 
    }
}