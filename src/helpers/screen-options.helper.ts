import {colors} from 'src/styles/colors';

export const getTitle = (name: string, isInternetConnected: boolean) => {
  return name + (!isInternetConnected ? ' (offline)' : '');
};

export const getHeaderBackgroundColor = (isInternetConnected: boolean) => {
  return isInternetConnected ? colors.primary : colors.warning;
};
