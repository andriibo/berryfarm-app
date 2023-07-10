import {StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '7%',
    justifyContent: 'space-around',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  label: {
    fontWeight: 'bold',
    color: colors.outline,
  },
  btn: {
    width: '70%',
    marginBottom: 25,
  },
});
