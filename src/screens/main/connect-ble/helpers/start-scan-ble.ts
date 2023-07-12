import {Dispatch} from '@reduxjs/toolkit';
import {Device} from 'react-native-ble-plx';
import {requestBluetoothPermission} from 'src/helpers/bluetooth-permission';
import {requestLocationPermission} from 'src/helpers/location-permission';
import {setDevices, setIsSearching} from 'src/stores/slices/connect-device.slice';
import {bleManager} from '../ConnectBle';
import {bleTechnowagy} from 'src/constants/constants';

const stopScan = (dispatch: Dispatch) => {
  bleManager.stopDeviceScan();
  dispatch(setIsSearching(false));
};

let timeout = 0;

export const startScanBle = async (dispatch: Dispatch, devices: Device[], connectedDevices: Device[]) => {
  const isGrantedLocation = await requestLocationPermission();
  const isGrantedBluetooth = await requestBluetoothPermission();

  clearTimeout(timeout);

  if (isGrantedLocation && isGrantedBluetooth) {
    bleManager.startDeviceScan(
      null,
      {
        allowDuplicates: false,
      },
      (error, device) => {
        if (error) {
          stopScan(dispatch);

          return;
        }

        if (
          device?.name?.includes(bleTechnowagy) &&
          ![...connectedDevices, ...devices].find(item => item.id === device?.id)
        ) {
          dispatch(setDevices([...devices, device]));
        }
      },
    );
  }

  timeout = setTimeout(() => stopScan(dispatch), 60 * 1000);

  return () => clearTimeout(timeout);
};
