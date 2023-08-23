import {Dimensions, StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  image: {
    width: '90%',
    height: '50%',
  },
  subheading: {
    marginBottom: 40,
    marginTop: -30,
  },
  btn: {
    borderRadius: 30,
    marginHorizontal: 50,
    height: 50,
    width: Dimensions.get('window').width - 100,
    marginBottom: 25,
  },
  btnSelected: {
    backgroundColor: 'rgba(100,166,68,255)',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  continue: {
    marginTop: 50,
  },
});
