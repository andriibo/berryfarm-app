import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

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
  birthDate: FirebaseFirestoreTypes.Timestamp;
  status?: WorkerStatus;
  createdTimestamp: FirebaseFirestoreTypes.Timestamp;
  syncTimestamp: FirebaseFirestoreTypes.Timestamp;
};
