import {PermissionsAndroid} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {isIOS, systemAlert} from 'src/constants/constants';
import {strings} from 'src/locales/locales';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const message = strings.toConnectToScalesWeNeedAccessToYourLocation;

export async function requestLocationPermission(navigation?: NativeStackNavigationProp<any>) {
  try {
    if (isIOS) {
      const isAlreadyGrantedAlwaysIOS = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
      const isAlreadyGrantedWhenInUseIOS = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (isAlreadyGrantedAlwaysIOS === RESULTS.GRANTED || isAlreadyGrantedWhenInUseIOS === RESULTS.GRANTED) {
        return true;
      }

      const result = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          systemAlert(strings.locationPermissionRequest, message, navigation);

          return false;
        case RESULTS.DENIED:
          systemAlert(strings.locationPermissionRequest, message, navigation);

          return false;
        case RESULTS.LIMITED:
          return true;
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          systemAlert(strings.locationPermissionRequest, message, navigation);

          return false;
      }
    }

    if (!isIOS) {
      const isAlreadyGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

      if (isAlreadyGranted) {
        return true;
      }

      const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: strings.locationPermissionForBluetoothScanning,
        message: strings.pleaseProvide,
        buttonNegative: strings.cancel,
        buttonPositive: strings.ok,
      });

      if (permission === RESULTS.GRANTED) {
        return true;
      }

      systemAlert(strings.locationPermissionRequest, message, navigation);
    }

    return false;
  } catch (err) {
    console.warn(err);

    return false;
  }
}
