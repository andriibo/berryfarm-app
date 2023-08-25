import {StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-evenly',
  },
  image: {
    width: '90%',
    height: '50%',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '90%',
  },
  btn: {
    borderRadius: 30,
    height: 50,
    width: '90%',
  },
  snackbar: {
    textAlign: 'center',
    color: colors.white,
  },
});
