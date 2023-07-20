import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {isIOS, systemAlert} from 'src/constants/constants';
import {PermissionsAndroid} from 'react-native';
import {strings} from 'src/locales/locales';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const message = strings.toConnectToScalesWeNeedAccessToYourBluetooth;

export async function requestBluetoothPermission(navigation?: NativeStackNavigationProp<any>) {
  try {
    if (isIOS) {
      const isAlreadyGrantedIOS = await check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);

      console.log(isAlreadyGrantedIOS);

      if (isAlreadyGrantedIOS === RESULTS.GRANTED) {
        return true;
      }

      request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL).then(res => {
        console.log(res);

        if (res === RESULTS.GRANTED) {
          return true;
        }

        systemAlert(strings.bluetoothPermissionRequest, message, navigation);
      });
    }

    if (!isIOS) {
      const isAlreadyGrantedScan = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
      const isAlreadyGrantedConnect = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);

      if (isAlreadyGrantedScan && isAlreadyGrantedConnect) {
        return true;
      }

      const permission = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      if (
        permission['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
        permission['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        return true;
      }

      systemAlert(strings.bluetoothPermissionRequest, message, navigation);
    }
  } catch (err) {
    console.warn(err);

    return false;
  }
}
