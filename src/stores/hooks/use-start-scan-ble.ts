import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dispatch} from '@reduxjs/toolkit';
import {useEffect} from 'react';
import {Alert, Linking} from 'react-native';
import {Device} from 'react-native-ble-plx';
import {bleManager} from 'src/screens/main/connect-ble';
import {startScanBle} from 'src/screens/main/connect-ble/helpers/start-scan-ble';
import {useActiveDeviceId} from 'src/stores/slices/connect-device.slice';
import {androidBLE, iosBLE, isIOS} from 'src/constants/constants';
import {strings} from 'src/locales/locales';

export const useStartScanBle = (
  dispatch: Dispatch,
  devices: Device[],
  connectedDevices: Device[],
  isDeviceConnected?: boolean,
) => {
  const activeDeviceId = useActiveDeviceId();

  useEffect(() => {
    AsyncStorage.getItem('deviceId').then(deviceId => {
      if (deviceId) {
        const subscription = bleManager.onStateChange(state => {
          if (state === 'PoweredOn' && !isDeviceConnected) {
            startScanBle(dispatch, devices, connectedDevices);
            subscription.remove();
          }

          if (state === 'PoweredOff') {
            bleManager.stopDeviceScan();
            Alert.alert(strings.technowagyNeedsBluetooth, strings.turnOnBluetoothInParameters, [
              {
                text: strings.cancel,
                style: 'cancel',
              },
              {
                text: strings.settings,
                onPress: () => {
                  isIOS ? Linking.openURL(iosBLE) : Linking.sendIntent(androidBLE);
                },
              },
            ]);
          }
        }, true);

        return () => subscription.remove();
      }
    });
  }, [activeDeviceId, connectedDevices, devices, dispatch, isDeviceConnected]);
};
