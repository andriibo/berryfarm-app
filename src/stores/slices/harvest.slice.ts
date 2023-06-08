import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {useAppSelector} from 'src/stores/hooks/hooks';
import {RootState} from 'src/stores/store';

export type IHarvest = {
  qty: number;
  workerUuid: string;
  harvestPackageId: number;
  locationId: number;
  productId: number;
  productQualityId: number;
};

type IHarvestState = {
  harvest: IHarvest;
};

const initialState: IHarvestState | any = {
  harvest: {
    qty: 0,
    workerUuid: '',
    harvestPackageId: 0,
    locationId: 0,
    productId: 0,
    productQualityId: 0,
  },
};

const authSlice = createSlice({
  name: 'Harvest',
  initialState,
  reducers: {
    setHarvest: (state: IHarvestState, {payload}: PayloadAction<IHarvest>) => {
      state.harvest.qty = payload.qty;
      state.harvest.workerUuid = payload.workerUuid;
      state.harvest.harvestPackageId = payload.harvestPackageId;
      state.harvest.locationId = payload.locationId;
      state.harvest.productId = payload.productId;
      state.harvest.productQualityId = payload.productQualityId;
    },
    cleanHarvest: (state: IHarvestState) => {
      state.harvest.qty = 0;
      state.harvest.workerUuid = '';
      state.harvest.harvestPackageId = 0;
      state.harvest.locationId = 0;
      state.harvest.productId = 0;
      state.harvest.productQualityId = 0;
    },
  },
});

export const selectHarvest = (state: RootState) => state.harvest.harvest;
export const useHarvest = () => useAppSelector(selectHarvest);

export const {
  reducer: harvestReducer,
  actions: {setHarvest, cleanHarvest},
} = authSlice;
