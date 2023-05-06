import {Dimensions, StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingLeft: 30,
    paddingRight: 30,
  },
  image: {
    width: '90%',
    height: '50%',
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    textAlign: 'center',
    marginBottom: 40,
    marginTop: -30,
  },
  btn: {
    width: Dimensions.get('window').width - 100,
    marginBottom: 25,
  },
  btnSelected: {
    backgroundColor: colors.primaryContainer,
  },
  continue: {
    marginTop: 50,
  },
});
