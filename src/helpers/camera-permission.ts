import {check, openSettings, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {isIOS} from 'src/constants/constants';
import {Alert, PermissionsAndroid} from 'react-native';
import {strings} from 'src/locales/locales';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const appSystemAlert = (navigation?: NativeStackNavigationProp<any>) => {
  Alert.alert(strings.cameraPermissionRequest, strings.toScanQrCodeWeNeedAccessToYourCamera, [
    {
      text: strings.cancel,
      style: 'cancel',
      onPress: () => navigation?.goBack(),
    },
    {text: strings.settings, onPress: openSettings},
  ]);
};

export async function requestCameraPermission(navigation?: NativeStackNavigationProp<any>) {
  try {
    if (isIOS) {
      const isAlreadyGrantedIOS = await check(PERMISSIONS.IOS.CAMERA);

      if (isAlreadyGrantedIOS === RESULTS.GRANTED) {
        return true;
      }

      request(PERMISSIONS.IOS.CAMERA).then(result => {
        if (result === RESULTS.GRANTED) {
          return true;
        }

        appSystemAlert(navigation);
      });
    } else {
      const isAlreadyGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);

      if (isAlreadyGranted) {
        return true;
      }

      const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

      if (permission === RESULTS.GRANTED) {
        return true;
      }

      appSystemAlert(navigation);
    }

    return false;
  } catch (err) {
    console.warn(err);

    return false;
  }
}
