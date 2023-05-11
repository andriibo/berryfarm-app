import firestore from '@react-native-firebase/firestore';
import {FirestoreServiceError} from 'src/stores/errors';
import {FarmsEnum} from 'src/enums/farms.enum';
import {User} from 'src/stores/types/user.type';
import {Farm} from 'src/stores/types/farm.type';

export const getFarm = async (farm: FarmsEnum) => {
  const doc = await firestore()
    .collection('farms')
    .doc(farm)
    .get()
    .catch(err => {
      throw new FirestoreServiceError(err);
    });

  if (doc.data() === undefined) {
    throw new FirestoreServiceError("Farm doesn't exist.");
  }

  return doc.data() as Farm;
};

export const login = async (username: string, prefix: string) => {
  const snapshot = await firestore()
    .collection(`${prefix}users`)
    .where('username', '==', username.trim())
    .get()
    .catch(err => {
      throw new FirestoreServiceError(err);
    });

  if (!snapshot.docs.length) {
    throw new FirestoreServiceError('Incorrect username.');
  }

  return snapshot.docs[0].data() as User;
};
