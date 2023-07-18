import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useRef} from 'react';
import {Subscription} from 'react-native-ble-plx';
import {connectDevice} from 'src/screens/main/connect-ble/helpers/connect-device';
import {disconnectDevice} from 'src/screens/main/connect-ble/helpers/disconnect-device';
import {bleManager} from 'src/screens/main/connect-ble';
import {useDevices, useIsDeviceConnected} from 'src/stores/slices/connect-device.slice';
import {useAppDispatch} from 'src/stores/hooks/hooks';

export const useAutoBleReconnect = () => {
  const dispatch = useAppDispatch();
  const deviceConnectionListener = useRef<Subscription>();
  const isDeviceConnected = useIsDeviceConnected();
  const devices = useDevices();

  useEffect(() => {
    AsyncStorage.getItem('deviceId').then(deviceId => {
      if (deviceId) {
        const device = devices.find(item => item.id === deviceId) || null;
        const subscription = bleManager.onStateChange(state => {
          if (state === 'PoweredOn' && !isDeviceConnected && device) {
            try {
              connectDevice(dispatch, device, deviceConnectionListener).then();
              subscription.remove();
            } catch (error) {
              disconnectDevice(dispatch, device);
              console.log('Device is off or unavailable');
            }
          }
        }, true);

        return () => subscription.remove();
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => deviceConnectionListener.current?.remove();
  }, [devices, dispatch, isDeviceConnected]);
};
