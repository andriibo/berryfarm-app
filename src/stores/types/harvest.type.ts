import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export type Harvest = {
  uuid: string;
  qty: number;
  harvestPackageId: number;
  locationId: number;
  productId: number;
  productQualityId: number;
  workerUuid: string;
  weightTotal: number;
  createdTimestamp: FirebaseFirestoreTypes.Timestamp;
  syncTimestamp: FirebaseFirestoreTypes.Timestamp;
};
