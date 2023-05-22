import {StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: -25,
    backgroundColor: colors.background,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'space-evenly',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-around',
    width: '90%',
    textAlign: 'center',
  },
});
