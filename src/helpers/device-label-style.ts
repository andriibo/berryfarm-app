import {colors} from 'src/styles/colors';
import {strings} from 'src/locales/locales';

export const deviceLabelStyle = (isDeviceConnected: boolean | undefined) => ({
  color: isDeviceConnected ? colors.primary : colors.error,
  title: isDeviceConnected ? strings.scalesConnected : strings.scalesNotConnected,
  icon: isDeviceConnected ? 'check-circle' : 'alert',
});
