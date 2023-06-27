import {Alert, PermissionsAndroid} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {isIOS} from 'src/constants/constants';
import {openSettings} from 'react-native-permissions';
import {strings} from 'src/locales/locales';
const systemAlert = (title: string, message: string) =>
  Alert.alert(title, message, [
    {
      text: strings.cancel,
      style: 'cancel',
    },
    {text: strings.settings, onPress: openSettings},
  ]);

export async function requestLocationPermission() {
  try {
    const message = strings.сonnectToScalesWeNeedAccess;

    if (isIOS) {
      const isAlreadyGrantedAlwaysIOS = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
      const isAlreadyGrantedWhenInUseIOS = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (isAlreadyGrantedAlwaysIOS === RESULTS.GRANTED || isAlreadyGrantedWhenInUseIOS === RESULTS.GRANTED) {
        return true;
      }

      const result = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          systemAlert(strings.requestLocation, message);

          return false;
        case RESULTS.DENIED:
          systemAlert(strings.requestLocation, message);

          return false;
        case RESULTS.LIMITED:
          return true;
        case RESULTS.GRANTED:
          return true;
        case RESULTS.BLOCKED:
          systemAlert(strings.requestLocation, message);

          return false;
      }
    }

    const isAlreadyGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

    if (isAlreadyGranted) {
      return true;
    }

    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: strings.locationPermissionRequiredForWiFiConnections,
      message: strings.pleaseProvide,
      buttonNegative: strings.cancel,
      buttonPositive: strings.ok,
    });

    if (granted) {
      return true;
    }

    systemAlert('Request Location', message);

    return false;
  } catch (err) {
    console.warn(err);

    return false;
  }
}
