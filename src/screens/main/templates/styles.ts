import {StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderColor: colors.black,
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  titleWrapper: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
