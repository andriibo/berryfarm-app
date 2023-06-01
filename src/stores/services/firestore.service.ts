import firestore, {firebase} from '@react-native-firebase/firestore';
import {FirestoreServiceError} from 'src/stores/errors';
import {FarmsEnum} from 'src/enums/farms.enum';
import {User} from 'src/stores/types/user.type';
import {Farm} from 'src/stores/types/farm.type';
import {Worker} from 'src/stores/types/worker.type';
import {HarvestTemplate} from 'src/stores/types/harvestTemplate.type';
import {sprintf} from 'sprintf-js';

const farmsCollection = 'farms';
const usersCollection = '%susers';
const workersCollection = '%sworkers';
const harvestTemplatesCollection = '%sharvest_templates';

export const getFarm = async (farm: FarmsEnum) => {
  const doc = await firestore()
    .collection(farmsCollection)
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

export const getTemplates = async (prefix: string) => {
  const collection = sprintf(harvestTemplatesCollection, prefix);
  const snapshot = await firestore()
    .collection(collection)
    .get()
    .catch(err => {
      throw new FirestoreServiceError(err);
    });

  if (!snapshot.docs.length) {
    throw new FirestoreServiceError('Templates not found.');
  }

  const templates: HarvestTemplate[] = [];

  snapshot.docs.forEach(doc => {
    if (doc.data()) {
      templates.push(doc.data() as HarvestTemplate);
    }
  });

  return templates;
};

export const login = async (username: string, prefix: string) => {
  const collection = sprintf(usersCollection, prefix);
  const snapshot = await firestore()
    .collection(collection)
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

export const createWorker = async (uuid: string, data: any, prefix: string) => {
  const worker = {
    ...data,
    uuid,
    syncTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    createdTimestamp: firebase.firestore.Timestamp.now(),
  };

  const collection = sprintf(workersCollection, prefix);

  await firestore()
    .collection(collection)
    .doc(uuid)
    .set(worker)
    .catch(err => {
      throw new FirestoreServiceError(err);
    });
};

export const findWorker = async (
  firstName: string,
  lastName: string,
  middleName: string,
  birthDate: Date,
  prefix: string,
) => {
  const collection = sprintf(workersCollection, prefix);
  const snapshot = await firestore()
    .collection(collection)
    .where('firstName', '==', firstName)
    .where('lastName', '==', lastName)
    .where('middleName', '==', middleName)
    .where('birthDate', '==', birthDate)
    .get()
    .catch(err => {
      throw new FirestoreServiceError(err);
    });

  if (snapshot.docs.length) {
    return snapshot.docs[0].data() as Worker;
  }

  return null;
};

export const findWorkerByUuid = async (uuid: string, prefix: string) => {
  const collection = sprintf(workersCollection, prefix);
  const snapshot = await firestore()
    .collection(collection)
    .doc(uuid)
    .get()
    .catch(err => {
      throw new FirestoreServiceError(err);
    });

  return snapshot.data() as Worker;
};
