import {Alert, Platform} from 'react-native';
import {strings} from 'src/locales/locales';
import dayjs from 'dayjs';
import {openSettings} from 'react-native-permissions';

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

export const systemAlert = (title: string, message: string) =>
  Alert.alert(title, message, [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {text: 'Settings', onPress: openSettings},
  ]);
