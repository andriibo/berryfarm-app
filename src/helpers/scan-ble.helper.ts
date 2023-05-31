import {Dispatch} from '@reduxjs/toolkit';
import {BleManager, Device} from 'react-native-ble-plx';

import {requestBluetoothPermission} from 'src/helpers/bluetooth-permission';
import {requestLocationPermission} from 'src/helpers/location-permission';
import {
  setDevices,
  setIsSearching,
} from 'src/stores/slices/connect-device.slice';

export const bleManager = new BleManager();

export const stopScanBle = (dispatch: Dispatch) => {
  bleManager.stopDeviceScan();
  dispatch(setIsSearching(false));
};

let timeout = 0;

export const startScanBle = async (
  dispatch: Dispatch,
  devices: Device[],
  connectedDevices: Device[],
) => {
  const isGrantedLocation = await requestLocationPermission();
  const isGrantedBluetooth = await requestBluetoothPermission();

  clearTimeout(timeout);

  if (isGrantedLocation && isGrantedBluetooth) {
    bleManager.startDeviceScan(
      null,
      {
        allowDuplicates: false,
      },
      async (error, device) => {
        if (error) {
          console.log(error);
          stopScanBle(dispatch);

          return;
        }

        console.log(555);
        console.log(device?.name);
        console.log(device?.id);
        if (device?.name === null) {
          console.log(await bleManager.isDeviceConnected('98:D3:34:90:F7:1B'));
        }

        if (
          device?.name?.includes('Technowagy') ||
          device?.id?.includes('98:D3:34:90:F7:1B')
        ) {
          console.log('Connected');
        }

        if (
          device?.name?.includes('Technowagy') &&
          ![...connectedDevices, ...devices].find(
            item => item.id === device?.id,
          )
        ) {
          dispatch(setDevices([...devices, device]));
        }
      },
    );
  }

  timeout = setTimeout(() => stopScanBle(dispatch), 60 * 1000);

  return () => clearTimeout(timeout);
};
