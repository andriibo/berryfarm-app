import firestore from '@react-native-firebase/firestore';
import {FirestoreServiceError} from 'src/stores/errors';
import {FarmsEnum} from 'src/enums/farms.enum';
import {User} from 'src/stores/types/user.type';
import {Farm} from 'src/stores/types/farm.type';
import {CreateWorkerRequest} from 'src/stores/requests/create-worker.request';
import {Worker} from 'src/stores/types/worker.type';
import {v4 as uuid} from 'uuid';
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

export const createWorker = async (
  data: CreateWorkerRequest,
  prefix: string,
) => {
  const worker = {...data, uuid: uuid()};
  const collection = sprintf(workersCollection, prefix);

  await firestore()
    .collection(collection)
    .doc(uuid())
    .set(worker)
    .catch(err => {
      throw new FirestoreServiceError(err);
    });

  return worker as Worker;
};

export const getWorkerByParams = async (
  data: CreateWorkerRequest,
  prefix: string,
) => {
  const collection = sprintf(workersCollection, prefix);
  const snapshot = await firestore()
    .collection(collection)
    .where('firstName', '==', data.firstName)
    .where('lastName', '==', data.lastName)
    .where('middleName', '==', data.middleName)
    .where('birthDate', '==', data.birthDate)
    .get()
    .catch(err => {
      throw new FirestoreServiceError(err);
    });

  if (snapshot.docs.length) {
    return snapshot.docs[0].data() as Worker;
  }

  return null;
};

export const getWorkersByName = async (name: string, prefix: string) => {
  const collection = sprintf(workersCollection, prefix);

  const snapshot = await firestore()
    .collection(collection)
    .get()
    .catch(err => {
      throw new FirestoreServiceError(err);
    });

  const workers: Worker[] = [];

  snapshot.docs.forEach(doc => {
    if (doc.data()) {
      workers.push(doc.data() as Worker);
    }
  });

  return workers.filter(worker => {
    return (
      worker.firstName?.toLowerCase().includes(name) ||
      worker.lastName?.toLowerCase().includes(name) ||
      worker.middleName?.toLowerCase().includes(name)
    );
  });
};
