import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {useAppSelector} from 'src/stores/hooks/hooks';
import {RootState} from 'src/stores/store';
import {Farm} from 'src/stores/types/farm.type';

export type FarmInfo = Pick<
  Farm,
  'apiUrlPrefix' | 'farmName' | 'firestorePrefix'
>;

type IFarm = {
  apiUrlPrefix: string;
  farmName: string;
  firestorePrefix: string;
};

type IFarmState = {
  farm: IFarm;
};

const initialState: IFarmState | any = {
  farm: {
    apiUrlPrefix: '',
    farmName: '',
    firestorePrefix: '',
  },
};

const authSlice = createSlice({
  name: 'Farm',
  initialState,
  reducers: {
    setFarm: (state: IFarmState, {payload}: PayloadAction<FarmInfo>) => {
      state.farm.apiUrlPrefix = payload.apiUrlPrefix;
      state.farm.farmName = payload.farmName;
      state.farm.firestorePrefix = payload.firestorePrefix;
    },
    cleanFarm: (state: IFarmState) => {
      state.farm.apiUrlPrefix = '';
      state.farm.farmName = '';
      state.farm.firestorePrefix = '';
    },
  },
});

export const selectFarm = (state: RootState) => state.farm.farm;
export const useFarm = () => useAppSelector(selectFarm);

export const {
  reducer: farmReducer,
  actions: {setFarm, cleanFarm},
} = authSlice;
