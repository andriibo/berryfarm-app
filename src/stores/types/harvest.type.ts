import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import Timestamp = FirebaseFirestoreTypes.Timestamp;

export type Harvest = {
  uuid: string;
  qty: number;
  harvestPackageId: number;
  locationId: number;
  productId: number;
  productQualityId: number;
  workerUuid: string;
  weightTotal: number;
  createdTimestamp: Timestamp;
  syncTimestamp: Timestamp;
};
