import {Dispatch} from '@reduxjs/toolkit';
import {Device} from 'react-native-ble-plx';
import {requestBluetoothPermission} from 'src/helpers/bluetooth-permission';
import {requestLocationPermission} from 'src/helpers/location-permission';
import {setDevices, setIsBleScanning} from 'src/stores/slices/connect-device.slice';
import {bleManager} from '../ConnectBle';
import {bleTechnowagy} from 'src/constants/constants';
import {stopScanBle} from 'src/screens/main/connect-ble/helpers/stop-scan-ble';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export const startScanBle = async (
  dispatch: Dispatch,
  devices: Device[],
  isBleScanning?: boolean,
  navigation?: NativeStackNavigationProp<any>,
) => {
  const isGrantedLocation = await requestLocationPermission(navigation);
  const isGrantedBluetooth = await requestBluetoothPermission(navigation);

  if (isGrantedLocation && isGrantedBluetooth && !isBleScanning) {
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

        if (device?.name?.includes(bleTechnowagy) && !devices.find(item => item.id === device?.id)) {
          devices = [...devices, device];
          dispatch(setDevices(devices));
        }
      },
    );
  }
};
