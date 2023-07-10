export type CreateHarvestRequest = {
  uuid: string;
  qty: number;
  harvestPackageId: number;
  locationId: number;
  productId: number;
  productQualityId: number;
  weightTotal: number;
  workerUuid?: string;
  qrCodeUuid?: string;
};
