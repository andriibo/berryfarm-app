import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import Timestamp = FirebaseFirestoreTypes.Timestamp;

export type QrCode = {
  id: number;
  uuid: string;
  workerUuid?: string;
  qrCodeUuid?: string;
  connectedTimestamp?: Timestamp;
  syncTimestamp?: Timestamp;
};
