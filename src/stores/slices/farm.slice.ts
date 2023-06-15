import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {useAppSelector} from 'src/stores/hooks/hooks';
import {RootState} from 'src/stores/store';
import {Farm} from 'src/stores/types/farm.type';

type IFarmState = {
  apiUrlPrefix: string;
  farmName: string;
  firestorePrefix: string;
};

const initialState: IFarmState = {
  apiUrlPrefix: '',
  farmName: '',
  firestorePrefix: '',
};

const farmSlice = createSlice({
  name: 'Farm',
  initialState,
  reducers: {
    setFarm: (state: IFarmState, {payload}: PayloadAction<Farm>) => {
      state.apiUrlPrefix = payload.apiUrlPrefix;
      state.farmName = payload.farmName;
      state.firestorePrefix = payload.firestorePrefix;
    },
    cleanFarm: (state: IFarmState) => {
      state.apiUrlPrefix = '';
      state.farmName = '';
      state.firestorePrefix = '';
    },
  },
});

export const selectFarm = (state: RootState) => state.farm;
export const useFarm = () => useAppSelector(selectFarm);

export const {
  reducer: farmReducer,
  actions: {setFarm, cleanFarm},
} = farmSlice;
