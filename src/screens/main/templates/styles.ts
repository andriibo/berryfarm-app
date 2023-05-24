import {StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderColor: colors.black,
    borderRadius: 10,
    borderWidth: 1,
    margin: 20,
  },
  titleWrapper: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
