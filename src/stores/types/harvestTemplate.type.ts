import {HarvestPackage} from 'src/stores/types/harvestPackage.type';
import {Product} from 'src/stores/types/product.type';
import {ProductQuality} from 'src/stores/types/productQuality.type';

export type HarvestTemplate = {
  id: number;
  qty: number;
  harvestPackage: HarvestPackage;
  location: {
    id: number;
    title: string;
  };
  product: Product;
  productQuality: ProductQuality;
};
