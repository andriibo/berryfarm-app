import firestore, {firebase} from '@react-native-firebase/firestore';
import {FirestoreServiceError} from 'src/stores/errors';
import {FarmsEnum} from 'src/enums/farms.enum';
import {User} from 'src/stores/types/user.type';
import {Farm} from 'src/stores/types/farm.type';
import {Worker} from 'src/stores/types/worker.type';
import {HarvestTemplate} from 'src/stores/types/harvestTemplate.type';
import {sprintf} from 'sprintf-js';
import {QrCode} from 'src/stores/types/qrCode.type';
import {CreateHarvestRequest} from 'src/stores/types/createHarvestRequest';
import {CreateWorkerRequest} from 'src/stores/types/createWorkerRequest';

const farmsCollection = 'farms';
const usersCollection = '%susers';
const workersCollection = '%sworkers';
const harvestCollection = '%sharvest';
const harvestTemplatesCollection = '%sharvest_templates';
const qrCodesCollection = '%sqr_codes';

export const getFarmByDoc = (document: FarmsEnum) => {
  return firestore()
    .collection(farmsCollection)
    .doc(document)
    .get()
    .then(snapshot => {
      if (snapshot.exists) {
        return snapshot.data() as Farm;
      }

      return null;
    })
    .catch(err => {
      throw new FirestoreServiceError(err);
    });
};

export const getFarms = () => {
  return firestore()
    .collection(farmsCollection)
    .get()
    .then(snapshot => {
      const farms: Farm[] = [];

      snapshot.docs.forEach(doc => {
        if (doc.data()) {
          farms.push(doc.data() as Farm);
        }
      });

      return farms;
    })
    .catch(err => {
      throw new FirestoreServiceError(err);
    });
};

export const getTemplates = async (prefix: string) => {
  const collection = sprintf(harvestTemplatesCollection, prefix);

  return firestore()
    .collection(collection)
    .get()
    .then(snapshot => {
      const templates: HarvestTemplate[] = [];

      snapshot.docs.forEach(doc => {
        if (doc.data()) {
          templates.push(doc.data() as HarvestTemplate);
        }
      });

      return templates;
    })
    .catch(error => {
      throw new FirestoreServiceError(error);
    });
};

export const getQrCodes = (prefix: string) => {
  const collection = sprintf(qrCodesCollection, prefix);

  return firestore()
    .collection(collection)
    .get()
    .then(snapshot => {
      const qrCodes: QrCode[] = [];

      snapshot.docs.forEach(doc => {
        if (doc.data()) {
          qrCodes.push(doc.data() as QrCode);
        }
      });

      return qrCodes;
    })
    .catch(error => {
      throw new FirestoreServiceError(error);
    });
};

export const getUserByUsername = async (username: string, prefix: string) => {
  const collection = sprintf(usersCollection, prefix);

  return firestore()
    .collection(collection)
    .where('username', '==', username.trim())
    .get()
    .then(snapshot => {
      if (!snapshot.docs.length) {
        return null;
      }

      return snapshot.docs[0].data() as User;
    })
    .catch(error => {
      throw new FirestoreServiceError(error);
    });
};

export const createWorker = (data: CreateWorkerRequest, prefix: string) => {
  const collection = sprintf(workersCollection, prefix);

  firestore()
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

export const createHarvest = (data: CreateHarvestRequest, prefix: string) => {
  const collection = sprintf(harvestCollection, prefix);

  firestore()
    .collection(collection)
    .doc(data.uuid)
    .set({
      ...data,
      syncTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
      createdTimestamp: firebase.firestore.Timestamp.now(),
    })
    .catch(error => {
      throw new FirestoreServiceError(error);
    });
};

export const getWorkerByParams = (
  firstName: string,
  lastName: string,
  middleName: string,
  birthDate: Date,
  prefix: string,
) => {
  const collection = sprintf(workersCollection, prefix);

  return firestore()
    .collection(collection)
    .where('firstName', '==', firstName)
    .where('lastName', '==', lastName)
    .where('middleName', '==', middleName)
    .where('birthDate', '==', birthDate)
    .get()
    .then(snapshot => {
      if (snapshot.docs.length) {
        return snapshot.docs[0].data() as Worker;
      }

      return null;
    })
    .catch(error => {
      throw new FirestoreServiceError(error);
    });
};

export const getWorkerByUuid = (uuid: string, prefix: string) => {
  const collection = sprintf(workersCollection, prefix);

  return firestore()
    .collection(collection)
    .doc(uuid)
    .get()
    .then(snapshot => {
      if (!snapshot.exists) {
        return null;
      }

      return snapshot.data() as Worker;
    })
    .catch(err => {
      throw new FirestoreServiceError(err);
    });
};

export const getQrCodeByUuid = (uuid: string, prefix: string) => {
  const collection = sprintf(qrCodesCollection, prefix);

  return firestore()
    .collection(collection)
    .doc(uuid)
    .get()
    .then(snapshot => {
      if (!snapshot.exists) {
        return null;
      }

      return snapshot.data() as QrCode;
    })
    .catch(err => {
      throw new FirestoreServiceError(err);
    });
};

export const updateQrCode = (qrCode: QrCode, prefix: string) => {
  const collection = sprintf(qrCodesCollection, prefix);

  firestore()
    .collection(collection)
    .doc(qrCode.uuid)
    .set({
      ...qrCode,
      connectedTimestamp: firebase.firestore.Timestamp.now(),
      syncTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .catch(error => {
      throw new FirestoreServiceError(error);
    });
};

export const getWorkers = (prefix: string) => {
  const collection = sprintf(workersCollection, prefix);

  return firestore()
    .collection(collection)
    .get()
    .then(snapshot => {
      const workers: Worker[] = [];

      snapshot.docs.forEach(doc => {
        if (doc.data()) {
          workers.push(doc.data() as Worker);
        }
      });

      return workers;
    })
    .catch(error => {
      throw new FirestoreServiceError(error);
    });
};

export const initData = async (prefix: string) => {
  try {
    await getFarms();
    await getWorkers(prefix);
    await getQrCodes(prefix);
    await getTemplates(prefix);
  } catch (error: any) {
    throw new FirestoreServiceError(error);
  }
};
