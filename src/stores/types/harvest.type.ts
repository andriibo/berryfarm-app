export type Harvest = {
  uuid: string;
  qty: number;
  harvestPackageId: number;
  locationId: number;
  productId: number;
  productQualityId: number;
  workerUuid: string;
  weightTotal: number;
  createdTimestamp: Date;
  syncTimestamp: Date;
};
