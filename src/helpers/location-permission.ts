import {Alert, Linking, PermissionsAndroid} from 'react-native';
import {check, openSettings, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {androidLocation, iosLocation, isIOS} from 'src/constants/constants';
import {strings} from 'src/locales/locales';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import DeviceInfo from 'react-native-device-info';

const appSystemAlert = (navigation?: NativeStackNavigationProp<any>) => {
  Alert.alert(strings.locationPermissionAppRequest, strings.toConnectToScalesWeNeedAccessToYourLocation, [
    {
      text: strings.cancel,
      style: 'cancel',
      onPress: () => navigation?.goBack(),
    },
    {
      text: strings.settings,
      onPress: () => openSettings(),
    },
  ]);
};

const deviceSystemAlert = (navigation?: NativeStackNavigationProp<any>) => {
  Alert.alert(strings.locationPermissionDeviceRequest, strings.toConnectToScalesWeNeedAccessToYourLocation, [
    {
      text: strings.cancel,
      style: 'cancel',
      onPress: () => navigation?.goBack(),
    },
    {
      text: strings.settings,
      onPress: () => {
        isIOS ? Linking.openURL(iosLocation) : Linking.sendIntent(androidLocation);
      },
    },
  ]);
};

export async function requestLocationPermission(navigation?: NativeStackNavigationProp<any>) {
  try {
    const deviceLocationEnabled = await DeviceInfo.isLocationEnabled();

    if (!deviceLocationEnabled) {
      deviceSystemAlert(navigation);

      return false;
    }

    if (isIOS) {
      const isAlreadyGrantedAlwaysIOS = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
      const isAlreadyGrantedWhenInUseIOS = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      if (isAlreadyGrantedAlwaysIOS === RESULTS.GRANTED || isAlreadyGrantedWhenInUseIOS === RESULTS.GRANTED) {
        return true;
      }

      const result = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);

      switch (result) {
        case RESULTS.UNAVAILABLE:
        case RESULTS.DENIED:
        case RESULTS.BLOCKED:
          appSystemAlert(navigation);

          return false;
        case RESULTS.LIMITED:
        case RESULTS.GRANTED:
          return true;
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

      appSystemAlert(navigation);
    }

    return false;
  } catch (err) {
    console.warn(err);

    return false;
  }
}
