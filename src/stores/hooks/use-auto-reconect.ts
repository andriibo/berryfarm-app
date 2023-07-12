import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dispatch} from '@reduxjs/toolkit';
import {useEffect, useRef} from 'react';
import {Device, Subscription} from 'react-native-ble-plx';
import {connectDevice} from 'src/screens/main/connect-ble/helpers/connect-device';
import {disconnectDevice} from 'src/screens/main/connect-ble/helpers/disconnect-device';

export const useAutoReconnect = (dispatch: Dispatch, devices: Device[], isDeviceConnected?: boolean) => {
  const deviceConnectionListener = useRef<Subscription>();

  useEffect(() => {
    AsyncStorage.getItem('deviceId').then(devId => {
      if (devId) {
        const device = devices.find(item => item.id === devId) || null;

        if (!isDeviceConnected && device) {
          try {
            connectDevice(dispatch, device, deviceConnectionListener).then();
          } catch (error) {
            disconnectDevice(dispatch, device);
            console.log('Device is off or not available');
          }
        }
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => deviceConnectionListener.current?.remove();
  }, [devices, dispatch, isDeviceConnected]);
};
