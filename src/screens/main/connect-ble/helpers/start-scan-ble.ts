import {Dispatch} from '@reduxjs/toolkit';
import {Device} from 'react-native-ble-plx';
import {requestBluetoothPermission} from 'src/helpers/bluetooth-permission';
import {requestLocationPermission} from 'src/helpers/location-permission';
import {setDevices, setIsBleScanning} from 'src/stores/slices/connect-device.slice';
import {bleManager} from '../ConnectBle';
import {bleTechnowagy} from 'src/constants/constants';
import {stopScanBle} from 'src/screens/main/connect-ble/helpers/stop-scan-ble';

let timeout: number | ReturnType<typeof setTimeout> = 0;

export const startScanBle = async (
  dispatch: Dispatch,
  devices: Device[],
  connectedDevices: Device[],
  isBleScanning?: boolean,
) => {
  const isGrantedLocation = await requestLocationPermission();
  const isGrantedBluetooth = await requestBluetoothPermission();

  clearTimeout(timeout);

  if (!isGrantedLocation || !isGrantedBluetooth || isBleScanning) {
    return;
  }

  dispatch(setIsBleScanning(true));
  bleManager.startDeviceScan(
    null,
    {
      allowDuplicates: false,
    },
    (error, device) => {
      if (error) {
        stopScanBle(dispatch);

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

  timeout = setTimeout(() => stopScanBle(dispatch), 10 * 1000);

  return () => clearTimeout(timeout);
};
