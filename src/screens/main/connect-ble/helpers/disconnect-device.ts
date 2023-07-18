import {Dispatch} from '@reduxjs/toolkit';
import {Device} from 'react-native-ble-plx';
import {
  setActiveDeviceId,
  setConnectedDevices,
  setIsDeviceConnected,
  setWeight,
} from 'src/stores/slices/connect-device.slice';

export const disconnectDevice = (dispatch: Dispatch, device: Device | null) => {
  dispatch(setActiveDeviceId(null));
  dispatch(setIsDeviceConnected(false));
  dispatch(setConnectedDevices([]));
  dispatch(setWeight(null));
  device?.cancelConnection();
};
