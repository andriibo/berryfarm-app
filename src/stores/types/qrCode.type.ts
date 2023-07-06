import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export type QrCode = {
  id: number;
  uuid: string;
  workerUuid?: string;
  qrCodeUuid?: string;
  connectedTimestamp?: FirebaseFirestoreTypes.Timestamp;
  syncTimestamp?: FirebaseFirestoreTypes.Timestamp;
};
