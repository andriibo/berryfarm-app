import {Platform} from 'react-native';
import {strings} from 'src/locales/locales';
import dayjs from 'dayjs';

export const errorMessages = {
  required: strings.fieldIsRequired,
  username: strings.maxUsernameCharacters,
  firstname: strings.maxFirstnameCharacters,
  lastname: strings.maxLastnameCharacters,
  surname: strings.maxSurnameCharacters,
} as const;

export const isIOS = Platform.OS === 'ios';
export const maxDATE = dayjs().subtract(1, 'day').toDate();
