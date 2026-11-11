import { db } from './config'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { handleReadError } from './errors';

export class ReadRepository {
    
  async get(collectionName, id) {
    try {
      const docRef = doc(db, collectionName, id);
      const snap = await getDoc(docRef);
      
      if (!snap.exists()) {
        throw { code: 'not-found', message: `document with Id "${id}" doesn't exist.` };
      }
      
      return { id: snap.id, ...snap.data() };
    } catch (error) {
      handleReadError(error);
    }
  }

  async getAll(collectionName) {
    try {
      const colRef = collection(db, collectionName);
      const snap = await getDocs(colRef);
      
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleReadError(error);
    }
  }

  async query(firestoreQuery) {
    try {
      const snap = await getDocs(firestoreQuery);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      handleReadError(error);
    }
  }
}
