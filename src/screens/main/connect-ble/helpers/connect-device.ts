import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dispatch} from '@reduxjs/toolkit';
import {MutableRefObject} from 'react';
import {Device, Subscription} from 'react-native-ble-plx';
import {setActiveDeviceId, setConnectedDevices, setIsDeviceConnected} from 'src/stores/slices/connect-device.slice';
import {bleManager} from '../ConnectBle';

export const connectDevice = async (
  dispatch: Dispatch,
  device: Device | null,
  deviceConnectionListener: MutableRefObject<Subscription | undefined>,
) => {
  if (device === null) {
    return;
  }

  const deviceObject = await bleManager.connectToDevice(device.id, {autoConnect: true});

  await deviceObject.onDisconnected(() => {
    dispatch(setIsDeviceConnected(false));
    deviceConnectionListener.current && deviceConnectionListener.current?.remove();
    deviceConnectionListener.current = undefined;
  });

  const isDeviceConnected = await deviceObject.isConnected();

  if (isDeviceConnected) {
    dispatch(setIsDeviceConnected(true));
    dispatch(setActiveDeviceId(device.id));
    dispatch(setConnectedDevices([]));
    dispatch(setConnectedDevices([device]));
    await AsyncStorage.setItem('deviceId', device.id);
  } else {
    console.log(deviceObject);
  }
};
