import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {useAppSelector} from 'src/stores/hooks/hooks';
import {RootState} from 'src/stores/store';
import {HarvestPackage} from 'src/stores/types/harvestPackage.type';
import {Location} from 'src/stores/types/location.type';
import {Product} from 'src/stores/types/product.type';
import {ProductQuality} from 'src/stores/types/productQuality.type';

export type IHarvest = {
  qty: number;
  workerUuid: string;
  harvestPackage: HarvestPackage;
  location: Location;
  product: Product;
  productQuality: ProductQuality;
};

type IHarvestState = {
  harvest: IHarvest;
};

const initialState: IHarvestState | any = {
  harvest: {
    qty: 0,
    workerUuid: '',
    harvestPackage: {
      id: 0,
      title: '',
    },
    location: {
      id: 0,
      title: '',
    },
    product: {
      id: 0,
      title: '',
    },
    productQuality: {
      id: 0,
      title: '',
    },
  },
};

const authSlice = createSlice({
  name: 'Harvest',
  initialState,
  reducers: {
    setHarvest: (state: IHarvestState, {payload}: PayloadAction<IHarvest>) => {
      state.harvest.qty = payload.qty;
      state.harvest.workerUuid = payload.workerUuid;
      state.harvest.harvestPackage = payload.harvestPackage;
      state.harvest.location = payload.location;
      state.harvest.product = payload.product;
      state.harvest.productQuality = payload.productQuality;
    },
    cleanHarvest: (state: IHarvestState) => {
      state.harvest.qty = 0;
      state.harvest.workerUuid = '';
      state.harvest.harvestPackage = {
        id: 0,
        title: '',
      };
      state.harvest.location = {
        id: 0,
        title: '',
      };
      state.harvest.product = {
        id: 0,
        title: '',
      };
      state.harvest.productQuality = {
        id: 0,
        title: '',
      };
    },
  },
});

export const selectHarvest = (state: RootState) => state.harvest.harvest;
export const useHarvest = () => useAppSelector(selectHarvest);

export const {
  reducer: harvestReducer,
  actions: {setHarvest, cleanHarvest},
} = authSlice;
