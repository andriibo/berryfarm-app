import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {androidBLE, iosBLE, isIOS} from 'src/constants/constants';
import {Alert, Linking, PermissionsAndroid} from 'react-native';
import {strings} from 'src/locales/locales';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const deviceSystemAlert = (navigation?: NativeStackNavigationProp<any>) => {
  Alert.alert(strings.bluetoothPermissionRequest, strings.toConnectToScalesWeNeedAccessToYourBluetooth, [
    {
      text: strings.cancel,
      style: 'cancel',
      onPress: () => navigation?.goBack(),
    },
    {
      text: strings.settings,
      onPress: () => {
        isIOS ? Linking.openURL(iosBLE) : Linking.sendIntent(androidBLE);
      },
    },
  ]);
};

export async function requestBluetoothPermission(navigation?: NativeStackNavigationProp<any>) {
  try {
    if (isIOS) {
      const isAlreadyGrantedIOS = await check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);

      if (isAlreadyGrantedIOS === RESULTS.GRANTED) {
        return true;
      }

      request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL).then(res => {
        if (res === RESULTS.GRANTED) {
          return true;
        }

        deviceSystemAlert(navigation);
      });
    } else {
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
        permission['android.permission.BLUETOOTH_CONNECT'] === RESULTS.GRANTED &&
        permission['android.permission.BLUETOOTH_SCAN'] === RESULTS.GRANTED
      ) {
        return true;
      }

      deviceSystemAlert(navigation);
    }

    return false;
  } catch (err) {
    console.warn(err);

    return false;
  }
}
