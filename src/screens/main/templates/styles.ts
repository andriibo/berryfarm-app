import {StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderColor: colors.black,
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  titleWrapper: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
