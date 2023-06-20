export type CreateHarvestRequest = {
  uuid: string | undefined;
  qty: number;
  harvestPackageId: number;
  locationId: number;
  productId: number;
  productQualityId: number;
  weightTotal: number;
  workerUuid?: string;
  qrCodeUuid?: string;
};
