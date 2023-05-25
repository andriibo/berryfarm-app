import {HarvestPackage} from 'src/stores/types/harvestPackage.type';
import {Location} from 'src/stores/types/location.type';
import {Product} from 'src/stores/types/product.type';
import {ProductQuality} from 'src/stores/types/product-quality.type';

export type HarvestTemplate = {
  id: number;
  qty: number;
  harvestPackage: HarvestPackage;
  location: Location;
  product: Product;
  productQuality: ProductQuality;
};
