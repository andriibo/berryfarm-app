import {wifiScalesKg} from 'src/constants/constants';

export const getFormattedWeightFromWiFiScales = (value: string) => {
  return Number(parseFloat(value.substring(value.indexOf(',') + 4, value.lastIndexOf(wifiScalesKg)).trim()).toFixed(2));
};
