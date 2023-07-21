import {Dimensions, StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
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
  },
  labelManual: {
    alignItems: 'center',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
  btn: {
    width: Dimensions.get('window').width - 100,
  },
});
