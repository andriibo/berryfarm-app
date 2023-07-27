import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {useAppSelector} from 'src/stores/hooks/hooks';
import {RootState} from 'src/stores/store';
import {HarvestPackage} from 'src/stores/types/harvestPackage.type';
import {Product} from 'src/stores/types/product.type';
import {ProductQuality} from 'src/stores/types/productQuality.type';

export type IHarvest = {
  qty: number | null;
  workerUuid?: string;
  qrCodeUuid?: string;
  harvestPackage: HarvestPackage | null;
  location: {
    id: number;
    title: string;
  } | null;
  product: Product;
  productQuality: ProductQuality | null;
};

type IHarvestState = {
  harvest: IHarvest;
};

const initialState: IHarvestState = {
  harvest: {
    qty: null,
    harvestPackage: null,
    location: null,
    product: {
      id: 0,
      title: '',
    },
    productQuality: null,
  },
};

const harvestSlice = createSlice({
  name: 'Harvest',
  initialState,
  reducers: {
    setHarvest: (state: IHarvestState, {payload}: PayloadAction<IHarvest>) => {
      state.harvest.qty = payload.qty;
      state.harvest.workerUuid = payload.workerUuid;
      state.harvest.qrCodeUuid = payload.qrCodeUuid;
      state.harvest.harvestPackage = payload.harvestPackage;
      state.harvest.location = payload.location;
      state.harvest.product = payload.product;
      state.harvest.productQuality = payload.productQuality;
    },
    cleanHarvest: (state: IHarvestState) => {
      state.harvest.qty = null;
      state.harvest.workerUuid = undefined;
      state.harvest.qrCodeUuid = undefined;
      state.harvest.harvestPackage = null;
      state.harvest.location = null;
      state.harvest.product = {
        id: 0,
        title: '',
      };
      state.harvest.productQuality = null;
    },
  },
});

export const selectHarvest = (state: RootState) => state.harvest.harvest;
export const useHarvest = () => useAppSelector(selectHarvest);

export const {
  reducer: harvestReducer,
  actions: {setHarvest, cleanHarvest},
} = harvestSlice;
