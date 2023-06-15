import {Dimensions, StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 30,
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
  notConnected: {
    marginBottom: 25,
  },
});
