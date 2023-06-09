import firestore, {firebase} from '@react-native-firebase/firestore';
import {FirestoreServiceError} from 'src/stores/errors';
import {FarmsEnum} from 'src/enums/farms.enum';
import {User} from 'src/stores/types/user.type';
import {Farm} from 'src/stores/types/farm.type';
import {Worker} from 'src/stores/types/worker.type';
import {HarvestTemplate} from 'src/stores/types/harvestTemplate.type';
import {sprintf} from 'sprintf-js';
import {QrCode} from 'src/stores/types/qrCode.type';

const farmsCollection = 'farms';
const usersCollection = '%susers';
const workersCollection = '%sworkers';
const harvestCollection = '%sharvest';
const harvestTemplatesCollection = '%sharvest_templates';
const qrCodesCollection = '%sqr_codes';

export const getFarm = async (farm: FarmsEnum) => {
  const snapshot = await firestore()
    .collection(farmsCollection)
    .doc(farm)
    .get()
    .catch(err => {
      throw new FirestoreServiceError(err);
    });

  return snapshot.data() ? (snapshot.data() as Farm) : null;
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

export const createWorker = async (data: any, prefix: string) => {
  const worker = {
    ...data,
    syncTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    createdTimestamp: firebase.firestore.Timestamp.now(),
  };

  const collection = sprintf(workersCollection, prefix);

  await firestore()
    .collection(collection)
    .doc(data.uuid)
    .set(worker)
    .catch(err => {
      throw new FirestoreServiceError(err);
    });
};

export const createHarvest = async (data: any, prefix: string) => {
  const collection = sprintf(harvestCollection, prefix);

  await firestore()
    .collection(collection)
    .doc(data.uuid)
    .set({
      ...data,
      syncTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
      createdTimestamp: firebase.firestore.Timestamp.now(),
    })
    .catch(err => {
      throw new FirestoreServiceError(err);
    });
};

export const getWorkerByParams = async (
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

export const getWorkerByUuid = async (uuid: string, prefix: string) => {
  const collection = sprintf(workersCollection, prefix);
  const snapshot = await firestore()
    .collection(collection)
    .doc(uuid)
    .get()
    .catch(err => {
      throw new FirestoreServiceError(err);
    });

  return snapshot.data() ? (snapshot.data() as Worker) : null;
};

export const getQrCodeByUuid = async (uuid: string, prefix: string) => {
  const collection = sprintf(qrCodesCollection, prefix);
  const snapshot = await firestore()
    .collection(collection)
    .doc(uuid)
    .get()
    .catch(err => {
      throw new FirestoreServiceError(err);
    });

  return snapshot.data() ? (snapshot.data() as QrCode) : null;
};

export const updateQrCode = async (qrCode: QrCode, prefix: string) => {
  const collection = sprintf(qrCodesCollection, prefix);

  await firestore()
    .collection(collection)
    .doc(qrCode.uuid)
    .set({
      ...qrCode,
      connectedTimestamp: firebase.firestore.Timestamp.now(),
      syncTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .catch(err => {
      throw new FirestoreServiceError(err);
    });
};

export const getWorkers = async (prefix: string) => {
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

  return workers;
};
