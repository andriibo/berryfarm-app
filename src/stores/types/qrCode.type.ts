export type QrCode = {
  id: number;
  uuid: string;
  workerUuid?: string;
  connectedTimestamp?: Date;
  syncTimestamp?: Date;
};
