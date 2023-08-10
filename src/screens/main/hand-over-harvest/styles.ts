import {Dimensions, StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: '7%',
    justifyContent: 'space-evenly',
  },
  weightIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  label: {
    fontWeight: 'bold',
    color: colors.outline,
    alignItems: 'center',
  },
  labelDisabled: {
    color: colors.outlineVariant,
  },
  labelManual: {
    alignItems: 'center',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
  btn: {
    width: Dimensions.get('window').width - 50,
  },
  snackbar: {
    textAlign: 'center',
    color: colors.white,
  },
});
