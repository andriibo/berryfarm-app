import {StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  area: {flex: 1, backgroundColor: colors.background},
  surface: {
    padding: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: colors.secondaryContainer,
  },
  titleWrapper: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
