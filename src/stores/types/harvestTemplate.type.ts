import {HarvestPackage} from 'src/stores/types/harvestPackage.type';
import {Product} from 'src/stores/types/product.type';
import {ProductQuality} from 'src/stores/types/productQuality.type';

export type HarvestTemplate = {
  id: number;
  qty: number | null;
  harvestPackage: HarvestPackage | null;
  location: {
    id: number;
    title: string;
  } | null;
  product: Product;
  productQuality: ProductQuality | null;
};
