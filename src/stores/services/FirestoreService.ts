import firestore from '@react-native-firebase/firestore';
import {FirestoreServiceError} from 'src/stores/errors';

export const login = async (username: string) => {
  const snapshot = await firestore()
    .collection('test_users')
    .where('username', '==', username.trim())
    .get()
    .catch(err => {
      throw new FirestoreServiceError(err);
    });

  if (!snapshot.docs.length) {
    throw new FirestoreServiceError('Incorrect username');
  }

  return snapshot.docs[0].data();
};
