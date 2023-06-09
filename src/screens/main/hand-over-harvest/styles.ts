import {Dimensions, StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: '7%',
    justifyContent: 'space-evenly',
  },
  btn: {
    width: Dimensions.get('window').width - 100,
  },
});
