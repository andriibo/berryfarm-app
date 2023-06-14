export type CreateHarvestRequest = {
  uuid: string;
  qty: number;
  harvestPackageId: number;
  locationId: number;
  productId: number;
  productQualityId: number;
  weightTotal: string;
  workerUuid?: string;
  qrCodeUuid?: string;
};
