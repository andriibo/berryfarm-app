import firestore, {firebase, FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {FirestoreServiceError} from 'src/stores/errors';
import {FarmsEnum} from 'src/enums/farms.enum';
import {User} from 'src/stores/types/user.type';
import {Farm} from 'src/stores/types/farm.type';
import {Worker, WorkerStatus} from 'src/stores/types/worker.type';
import {HarvestTemplate} from 'src/stores/types/harvestTemplate.type';
import {sprintf} from 'sprintf-js';
import {QrCode} from 'src/stores/types/qrCode.type';
import {CreateHarvestRequest} from 'src/stores/types/createHarvestRequest';
import {ProductQualityPackages, ProductQualityPackagesStatus} from 'src/stores/types/productQualityPackages.type';
import {Product, ProductStatus} from 'src/stores/types/product.type';
import {Zone, ZoneStatus} from 'src/stores/types/zone.type';

const farmsCollection = 'farms';
const usersCollection = '%susers';
const workersCollection = '%sworkers';
const harvestCollection = '%sharvest';
const harvestTemplatesCollection = '%sharvest_templates';
const qrCodesCollection = '%sqr_codes';
const productQualityPackagesCollection = '%sproduct_quality_packages';
const productsCollection = '%sproducts';
const zonesCollection = '%szones';

export const getFarmByDoc = async (document: FarmsEnum) => {
  const snapshot = await firestore()
    .collection(farmsCollection)
    .doc(document)
    .get()
    .catch(err => {
      throw new FirestoreServiceError(err);
    });

  return snapshot.data() ? (snapshot.data() as Farm) : null;
};

export const getFarms = async () => {
  const snapshot = await firestore()
    .collection(farmsCollection)
    .get()
    .catch(err => {
      throw new FirestoreServiceError(err);
    });

  const farms: Farm[] = [];

  snapshot.docs.forEach(doc => {
    if (doc.data()) {
      farms.push(doc.data() as Farm);
    }
  });

  return farms;
};

export const getZones = async (prefix: string) => {
  const collection = sprintf(zonesCollection, prefix);

  const snapshot = await firestore()
    .collection(collection)
    .where('status', '==', ZoneStatus.active)
    .get()
    .catch(error => {
      throw new FirestoreServiceError(error);
    });

  const zones: Zone[] = [];

  snapshot.docs.forEach(doc => {
    if (doc.data()) {
      zones.push(doc.data() as Zone);
    }
  });

  return zones;
};

export const getAllTemplates = async (prefix: string) => {
  const collection = sprintf(harvestTemplatesCollection, prefix);

  const snapshot = await firestore()
    .collection(collection)
    .get()
    .catch(error => {
      throw new FirestoreServiceError(error);
    });

  const templates: HarvestTemplate[] = [];

  snapshot.docs.forEach(doc => {
    if (doc.data()) {
      templates.push(doc.data() as HarvestTemplate);
    }
  });

  return templates;
};

export const getTemplatesByLocationIds = async (prefix: string, locationIds: Array<number> = []) => {
  const collection = sprintf(harvestTemplatesCollection, prefix);
  let snapshot;

  if (locationIds.length) {
    const queries: Array<FirebaseFirestoreTypes.QueryFilterConstraint> = [];

    locationIds.forEach(locationId => {
      queries.push(firebase.firestore.Filter('location.id', '==', locationId));
    });
    queries.push(firebase.firestore.Filter('location', '==', null));
    snapshot = await firestore()
      .collection(collection)
      .where(firebase.firestore.Filter.or(...queries))
      .get()
      .catch(error => {
        throw new FirestoreServiceError(error);
      });
  } else {
    snapshot = await firestore()
      .collection(collection)
      .where('location', '==', null)
      .get()
      .catch(error => {
        throw new FirestoreServiceError(error);
      });
  }

  const templates: HarvestTemplate[] = [];

  snapshot.docs.forEach(doc => {
    if (doc.data()) {
      templates.push(doc.data() as HarvestTemplate);
    }
  });

  return templates;
};

export const getProductQualityPackages = async (prefix: string) => {
  const collection = sprintf(productQualityPackagesCollection, prefix);

  const snapshot = await firestore()
    .collection(collection)
    .where('status', '==', ProductQualityPackagesStatus.active)
    .get()
    .catch(error => {
      throw new FirestoreServiceError(error);
    });

  const items: ProductQualityPackages[] = [];

  snapshot.docs.forEach(doc => {
    if (doc.data()) {
      items.push(doc.data() as ProductQualityPackages);
    }
  });

  return items;
};

export const getProductQualityPackagesByProductId = async (productId: number, prefix: string) => {
  const collection = sprintf(productQualityPackagesCollection, prefix);

  const snapshot = await firestore()
    .collection(collection)
    .where('product.id', '==', productId)
    .where('status', '==', ProductQualityPackagesStatus.active)
    .get()
    .catch(error => {
      throw new FirestoreServiceError(error);
    });

  const items: ProductQualityPackages[] = [];

  snapshot.docs.forEach(doc => {
    if (doc.data()) {
      items.push(doc.data() as ProductQualityPackages);
    }
  });

  return items;
};

export const getQrCodes = async (prefix: string) => {
  const collection = sprintf(qrCodesCollection, prefix);
  const snapshot = await firestore()
    .collection(collection)
    .get()
    .catch(error => {
      throw new FirestoreServiceError(error);
    });

  const qrCodes: QrCode[] = [];

  snapshot.docs.forEach(doc => {
    if (doc.data()) {
      qrCodes.push(doc.data() as QrCode);
    }
  });

  return qrCodes;
};

export const getProducts = async (prefix: string) => {
  const collection = sprintf(productsCollection, prefix);
  const snapshot = await firestore()
    .collection(collection)
    .where('status', '==', ProductStatus.active)
    .get()
    .catch(error => {
      throw new FirestoreServiceError(error);
    });

  const products: Product[] = [];

  snapshot.docs.forEach(doc => {
    if (doc.data()) {
      products.push(doc.data() as Product);
    }
  });

  return products;
};

export const getUserByUsername = async (username: string, prefix: string) => {
  const collection = sprintf(usersCollection, prefix);

  const snapshot = await firestore()
    .collection(collection)
    .where('username', '==', username.trim())
    .get()
    .catch(error => {
      throw new FirestoreServiceError(error);
    });

  if (!snapshot.docs.length) {
    return null;
  }

  return snapshot.docs[0].data() as User;
};

export const createWorker = (
  data: {
    uuid: string;
    firstName: string;
    lastName: string;
    middleName: string | null;
    birthDate: FirebaseFirestoreTypes.Timestamp | null;
    status: WorkerStatus;
  },
  prefix: string,
) => {
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

export const getWorkerByParams = async (
  firstName: string,
  lastName: string,
  middleName: string | null,
  birthDate: FirebaseFirestoreTypes.Timestamp | null,
  prefix: string,
) => {
  const collection = sprintf(workersCollection, prefix);

  const snapshot = await firestore()
    .collection(collection)
    .where(
      firebase.firestore.Filter.and(
        firebase.firestore.Filter('firstName', '==', firstName),
        firebase.firestore.Filter('lastName', '==', lastName),
        firebase.firestore.Filter('middleName', '==', middleName),
        firebase.firestore.Filter('birthDate', '==', birthDate),
      ),
    )
    .where('status', '==', WorkerStatus.active)
    .get()
    .catch(error => {
      throw new FirestoreServiceError(error);
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
    .catch(error => {
      throw new FirestoreServiceError(error);
    });

  return snapshot.data() ? (snapshot.data() as Worker) : null;
};

export const getQrCodeByUuid = async (uuid: string, prefix: string) => {
  const collection = sprintf(qrCodesCollection, prefix);

  const snapshot = await firestore()
    .collection(collection)
    .doc(uuid)
    .get()
    .catch(error => {
      throw new FirestoreServiceError(error);
    });

  return snapshot.data() ? (snapshot.data() as QrCode) : null;
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

export const getWorkers = async (prefix: string) => {
  const collection = sprintf(workersCollection, prefix);

  const snapshot = await firestore()
    .collection(collection)
    .where('status', '==', WorkerStatus.active)
    .get()
    .catch(error => {
      throw new FirestoreServiceError(error);
    });

  const workers: Worker[] = [];

  snapshot.docs.forEach(doc => {
    if (doc.data()) {
      workers.push(doc.data() as Worker);
    }
  });

  return workers;
};

export const initData = async (prefix: string) => {
  try {
    await Promise.all([
      getFarms(),
      getWorkers(prefix),
      getQrCodes(prefix),
      getZones(prefix),
      getAllTemplates(prefix),
      getProducts(prefix),
      getProductQualityPackages(prefix),
    ]);
  } catch (error: any) {
    throw new FirestoreServiceError(error);
  }
};
