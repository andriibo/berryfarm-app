import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {isIOS, systemAlert} from 'src/constants/constants';
import {PermissionsAndroid} from 'react-native';

const message =
  'To connect to a scales, we need access to your Bluetooth. Go to settings to enable the Bluetooth permission.';

export async function requestBluetoothPermission() {
  try {
    if (isIOS) {
      const isAlreadyGrantedIOS = await check(
        PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
      );

      if (isAlreadyGrantedIOS === RESULTS.GRANTED) {
        return true;
      }

      const result = await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);

      if (result === RESULTS.GRANTED) {
        return true;
      }

      systemAlert('Request Bluetooth', message);
    }

    const isAlreadyGrantedScan = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    );
    const isAlreadyGrantedConnect = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    );

    if (isAlreadyGrantedScan && isAlreadyGrantedConnect) {
      return true;
    }

    const perm = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);

    if (
      perm['android.permission.BLUETOOTH_CONNECT'] === 'granted' &&
      perm['android.permission.BLUETOOTH_SCAN'] === 'granted'
    ) {
      return true;
    }

    systemAlert('Request Bluetooth', message);
  } catch (err) {
    console.warn(err);

    return false;
  }
}
