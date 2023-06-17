import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {useAppSelector} from 'src/stores/hooks/hooks';
import {RootState} from 'src/stores/store';

type IDeviceState = {
  loadedData: boolean;
};

const initialState: IDeviceState = {
  loadedData: false,
};

const deviceSlice = createSlice({
  name: 'Device',
  initialState,
  reducers: {
    setLoadedData: (state: IDeviceState, {payload}: PayloadAction<boolean>) => {
      state.loadedData = payload;
    },
  },
});

export const selectLoadedData = (state: RootState) => state.device.loadedData;
export const useLoadedData = () => useAppSelector(selectLoadedData);

export const {
  reducer: deviceReducer,
  actions: {setLoadedData},
} = deviceSlice;
