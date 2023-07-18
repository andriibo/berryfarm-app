import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dispatch} from '@reduxjs/toolkit';
import {useEffect} from 'react';
import {Device} from 'react-native-ble-plx';
import {bleManager} from 'src/screens/main/connect-ble';
import {startScanBle} from 'src/screens/main/connect-ble/helpers/start-scan-ble';
import {useActiveDeviceId, useIsBleScanning} from 'src/stores/slices/connect-device.slice';

export const useStartScanBle = (
  dispatch: Dispatch,
  devices: Device[],
  connectedDevices: Device[],
  isDeviceConnected?: boolean,
) => {
  const activeDeviceId = useActiveDeviceId();
  const isBleScanning = useIsBleScanning();

  useEffect(() => {
    AsyncStorage.getItem('deviceId').then(deviceId => {
      if (deviceId) {
        const subscription = bleManager.onStateChange(state => {
          if (state === 'PoweredOn' && !isDeviceConnected) {
            startScanBle(dispatch, devices, connectedDevices, isBleScanning).then();
            subscription.remove();
          }
        }, true);

        return () => subscription.remove();
      }
    });
  }, [activeDeviceId, connectedDevices, devices, dispatch, isBleScanning, isDeviceConnected]);
};
