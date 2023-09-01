import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {useAppSelector} from 'src/stores/hooks/hooks';
import {RootState} from 'src/stores/store';
import {HarvestPackage} from 'src/stores/types/harvestPackage.type';
import {Product} from 'src/stores/types/product.type';
import {ProductQuality} from 'src/stores/types/productQuality.type';
import {Location} from 'src/stores/types/location.type';

export type IHarvestTemplate = {
  qty: number | null;
  workerUuid?: string;
  qrCodeUuid?: string;
  harvestPackage: HarvestPackage | null;
  location: Omit<Location, 'status'> | null;
  product: Omit<Product, 'locations' | 'status'> | null;
  productQuality: ProductQuality | null;
};

type IHarvestTemplateState = {
  harvestTemplate: IHarvestTemplate;
};

const initialState: IHarvestTemplateState = {
  harvestTemplate: {
    qty: null,
    harvestPackage: null,
    location: null,
    product: null,
    productQuality: null,
  },
};

const harvestTemplateSlice = createSlice({
  name: 'HarvestTemplate',
  initialState,
  reducers: {
    setHarvestTemplate: (state: IHarvestTemplateState, {payload}: PayloadAction<IHarvestTemplate>) => {
      state.harvestTemplate.qty = payload.qty;
      state.harvestTemplate.workerUuid = payload.workerUuid;
      state.harvestTemplate.qrCodeUuid = payload.qrCodeUuid;
      state.harvestTemplate.harvestPackage = payload.harvestPackage;
      state.harvestTemplate.location = payload.location;
      state.harvestTemplate.product = payload.product;
      state.harvestTemplate.productQuality = payload.productQuality;
    },
    cleanHarvestTemplate: (state: IHarvestTemplateState) => {
      state.harvestTemplate.qty = null;
      state.harvestTemplate.workerUuid = undefined;
      state.harvestTemplate.qrCodeUuid = undefined;
      state.harvestTemplate.harvestPackage = null;
      state.harvestTemplate.location = null;
      state.harvestTemplate.product = null;
      state.harvestTemplate.productQuality = null;
    },
  },
});

export const selectHarvestTemplate = (state: RootState) => state.harvestTemplate.harvestTemplate;
export const useHarvestTemplate = () => useAppSelector(selectHarvestTemplate);

export const {
  reducer: harvestTemplateReducer,
  actions: {setHarvestTemplate, cleanHarvestTemplate},
} = harvestTemplateSlice;
