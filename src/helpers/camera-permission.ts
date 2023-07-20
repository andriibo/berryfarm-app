import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {isIOS, systemAlert} from 'src/constants/constants';
import {PermissionsAndroid} from 'react-native';
import {strings} from 'src/locales/locales';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const message = strings.toScanQrCodeWeNeedAccessToYourCamera;

export async function requestCameraPermission(navigation?: NativeStackNavigationProp<any>) {
  try {
    if (isIOS) {
      const isAlreadyGrantedIOS = await check(PERMISSIONS.IOS.CAMERA);

      console.log(isAlreadyGrantedIOS);

      if (isAlreadyGrantedIOS === RESULTS.GRANTED) {
        return true;
      }

      request(PERMISSIONS.IOS.CAMERA).then(res => {
        console.log(res);

        if (res === RESULTS.GRANTED) {
          return true;
        }

        systemAlert(strings.cameraPermissionRequest, message, navigation);
      });
    }

    if (!isIOS) {
      const isAlreadyGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);

      if (isAlreadyGranted) {
        return true;
      }

      const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

      if (permission === 'granted') {
        return true;
      }

      systemAlert(strings.cameraPermissionRequest, message, navigation);
    }
  } catch (err) {
    console.warn(err);

    return false;
  }
}
