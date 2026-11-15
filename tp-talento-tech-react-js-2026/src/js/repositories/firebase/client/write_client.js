import { db } from './config';
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { handleDeleteError, handleUpdateError, handleCreateError } from './errors';

export class WriteClient {
    constructor(collectionName){
        this.collectionName = collectionName
    }

    async insert(id, data) {
        return setDoc(doc(db, this.collectionName, id), data)
            .catch(handleCreateError)
    }

    async update(data) {
        try {
            await updateDoc(doc(db, this.collectionName, data.id), data);
        } catch (e) {
            handleUpdateError(e);
        }
    }

  async delete(id) {
    try {
        await deleteDoc(doc(db, this.collectionName, id));
    } catch (e) {
        handleDeleteError(e);
    }
  }
}
