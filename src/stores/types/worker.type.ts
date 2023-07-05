import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import Timestamp = FirebaseFirestoreTypes.Timestamp;

export enum WorkerStatus {
  active = 'active',
  deleted = 'deleted',
  inactive = 'inactive',
}

export type Worker = {
  uuid: string;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: Timestamp;
  status: WorkerStatus;
  createdTimestamp: Timestamp;
  syncTimestamp: Timestamp;
};
