import {StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  area: {flex: 1, backgroundColor: colors.background},
  surface: {
    padding: 8,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  titleWrapper: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: colors.onSurfaceVariant,
    flexWrap: 'wrap',
  },
});
