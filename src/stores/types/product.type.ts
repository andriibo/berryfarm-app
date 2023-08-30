import {Location} from 'src/stores/types/location.type';

export enum ProductStatus {
  active = 'active',
  inactive = 'inactive',
}

export type Product = {
  id: number;
  title: string;
  locations: Array<Location>;
  status: ProductStatus;
};
