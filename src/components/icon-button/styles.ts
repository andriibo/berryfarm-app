import {StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  viewContainerStyle: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
  },
  iconStyle: {
    alignSelf: 'center',
    color: colors.primary,
  },
  textStyle: {
    color: colors.black,
    fontSize: 16,
    paddingHorizontal: 5,
    fontWeight: '400',
    letterSpacing: 0.15,
  },
});
