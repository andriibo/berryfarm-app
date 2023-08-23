import {StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
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
