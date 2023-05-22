import {Platform} from 'react-native';
import {strings} from 'src/locales/locales';

export const errorMessages = {
  required: strings.fieldIsRequired,
  username: strings.maxUsernameCharacters,
  firstname: strings.maxFirstnameCharacters,
  lastname: strings.maxLastnameCharacters,
  surname: strings.maxSurnameCharacters,
} as const;

export const isIOS = Platform.OS === 'ios';
