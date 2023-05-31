import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Device} from 'react-native-ble-plx';

import {RootState} from '../store';
import {useAppSelector} from 'src/stores/hooks/hooks';

interface IConnectDevice {
  isSearching?: boolean;
  isDeviceConnected?: boolean;
  activeDeviceId?: string | null;
  devices: Device[];
  connectedDevices: Device[];
}

const initialState: IConnectDevice = {
  isSearching: true,
  isDeviceConnected: false,
  activeDeviceId: null,
  devices: [],
  connectedDevices: [],
};

const connectDeviceSlice = createSlice({
  name: 'ConnectDevice',
  initialState,
  reducers: {
    setIsSearching: (state, {payload}: PayloadAction<boolean>) => {
      state.isSearching = payload;
    },
    setDevices: (state, {payload}: PayloadAction<Device[]>) => {
      state.devices = payload;
    },
    setConnectedDevices: (state, {payload}: PayloadAction<Device[]>) => {
      state.connectedDevices = payload;
    },
    setIsDeviceConnected: (state, {payload}: PayloadAction<boolean>) => {
      state.isDeviceConnected = payload;
    },
    setActiveDeviceId: (state, {payload}: PayloadAction<string | null>) => {
      state.activeDeviceId = payload;
    },
  },
});

export const selectIsSearching = (state: RootState) =>
  state.connectDevice.isSearching;
export const selectIsDeviceConnected = (state: RootState) =>
  state.connectDevice.isDeviceConnected;
export const selectActiveDeviceId = (state: RootState) =>
  state.connectDevice.activeDeviceId;
export const selectDevices = (state: RootState) => state.connectDevice.devices;
export const selectConnectedDevices = (state: RootState) =>
  state.connectDevice.connectedDevices;
export const useIsSearching = () => useAppSelector(selectIsSearching);
export const useIsDeviceConnected = () =>
  useAppSelector(selectIsDeviceConnected);
export const useActiveDeviceId = () => useAppSelector(selectActiveDeviceId);
export const useDevices = () => useAppSelector(selectDevices);
export const useConnectedDevices = () => useAppSelector(selectConnectedDevices);

export const {
  reducer: connectDeviceReducer,
  actions: {
    setIsSearching,
    setIsDeviceConnected,
    setActiveDeviceId,
    setDevices,
    setConnectedDevices,
  },
} = connectDeviceSlice;
