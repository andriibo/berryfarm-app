import {HarvestPackage} from 'src/stores/types/harvestPackage.type';
import {Product} from 'src/stores/types/product.type';
import {ProductQuality} from 'src/stores/types/productQuality.type';

export enum ProductQualityPackagesStatus {
  active = 'active',
  inactive = 'inactive',
  deleted = 'deleted',
  archived = 'archived',
}

export type ProductQualityPackages = {
  id: number;
  harvestPackage: HarvestPackage;
  product: Product;
  productQuality: ProductQuality;
  status: ProductQualityPackagesStatus;
};
