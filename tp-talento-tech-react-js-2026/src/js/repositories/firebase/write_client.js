import { db } from './config';
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { handleDeleteError, handleUpdateError, handleCreateError } from './errors';

export class WriteRepository {
    async create(collectionName, id, data) {
        try {
           await setDoc(doc(db, collectionName, id), data);
        } catch (e) {
            handleCreateError(e);
        }
    }

    async update(collectionName, id, data) {
        try {
            await updateDoc(doc(db, collectionName, id), data);
        } catch (e) {
            handleUpdateError(e);
        }
    }

  async delete(collectionName, id) {
    try {
        await deleteDoc(doc(db, collectionName, id));
    } catch (e) {
        handleDeleteError(e);
    }
  }
}
