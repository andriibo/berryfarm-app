export type QrCode = {
  id: number;
  uuid: string;
  workerUuid?: string;
  qrCodeUuid?: string;
  connectedTimestamp?: Date;
  syncTimestamp?: Date;
};
