import {Dimensions, StyleSheet} from 'react-native';
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
    width: Dimensions.get('window').width - 100,
    marginBottom: 25,
    marginTop: 50,
  },
  snackbar: {
    textAlign: 'center',
    color: colors.white,
  },
});
