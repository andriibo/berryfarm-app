import {Dimensions, StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '7%',
    justifyContent: 'space-evenly',
  },
  label: {
    fontWeight: 'bold',
    color: colors.outline,
  },
  btn: {
    width: Dimensions.get('window').width - 100,
  },
});
