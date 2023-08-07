import {HarvestPackage} from 'src/stores/types/harvestPackage.type';
import {ProductQuality} from 'src/stores/types/productQuality.type';
import {Location} from 'src/stores/types/location.type';
import {Product} from 'src/stores/types/product.type';

export type HarvestTemplate = {
  id: number;
  qty: number | null;
  harvestPackage: HarvestPackage | null;
  location: Omit<Location, 'status'> | null;
  product: Omit<Product, 'status'>;
  productQuality: ProductQuality | null;
};
