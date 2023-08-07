export enum ProductStatus {
  active = 'active',
  inactive = 'inactive',
}

export type Product = {
  id: number;
  title: string;
  status: ProductStatus;
};
