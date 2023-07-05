import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import Timestamp = FirebaseFirestoreTypes.Timestamp;

export type Worker = {
  uuid: string;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: Timestamp;
  createdTimestamp: Timestamp;
  syncTimestamp: Timestamp;
};
