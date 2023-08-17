import {Platform} from 'react-native';
import {strings} from 'src/locales/locales';
import dayjs from 'dayjs';

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
export const iosLocation = 'App-Prefs:LOCATION_SERVICES';
export const androidBLE = 'android.settings.BLUETOOTH_SETTINGS';
export const androidLocation = 'android.settings.LOCATION_SOURCE_SETTINGS';
export const maxDATE = dayjs().subtract(1, 'day').toDate();
