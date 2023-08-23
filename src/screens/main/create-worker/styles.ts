import {StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    justifyContent: 'space-around',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-around',
    width: '100%',
    textAlign: 'center',
  },
  label: {
    color: colors.outline,
  },
  btn: {
    borderRadius: 30,
    height: 50,
    width: '100%',
    marginBottom: 25,
  },
});
