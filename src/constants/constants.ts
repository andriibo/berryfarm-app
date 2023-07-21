import {Alert, Platform} from 'react-native';
import {strings} from 'src/locales/locales';
import dayjs from 'dayjs';
import {openSettings} from 'react-native-permissions';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export const errorMessages = {
  required: strings.fieldIsRequired,
  number: strings.mustBeNumber,
  username: strings.maxUsernameCharacters,
  firstName: strings.maxFirstNameCharacters,
  lastName: strings.maxLastNameCharacters,
  middleName: strings.maxMiddleNameCharacters,
  minWeight: strings.minValue01,
  maxWeight: strings.maxValue999999,
  minQty: strings.minValue1,
} as const;

export const isIOS = Platform.OS === 'ios';
export const bleTechnowagy = 'Technowagy';
export const iosBLE = 'App-Prefs:Bluetooth';
export const androidBLE = 'android.settings.BLUETOOTH_SETTINGS';
export const maxDATE = dayjs().subtract(1, 'day').toDate();

export const systemAlert = (title: string, message: string, navigation?: NativeStackNavigationProp<any>) => {
  Alert.alert(title, message, [
    {
      text: strings.cancel,
      style: 'cancel',
      onPress: () => navigation?.goBack(),
    },
    {text: strings.settings, onPress: openSettings},
  ]);
};
