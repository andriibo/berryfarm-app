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
  minWeight: strings.minWeight,
  maxWeight: strings.maxWeight,
} as const;

export const isIOS = Platform.OS === 'ios';
export const maxDATE = dayjs().subtract(1, 'day').toDate();

export const wifiScalesTcpOptions = {
  port: 1234,
  host: '192.168.4.1',
  reuseAddress: true,
};
export const wifiScalesSSID = 'ESP8266';
export const wifiScalesKg = 'kg';
export const wifiScalesLb = 'lb';
