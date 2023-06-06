import {Dimensions, StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export const width = Dimensions.get('window').width / 3 - 20;

export default StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    backgroundColor: colors.background,
    borderColor: colors.black,
    borderRadius: 10,
    borderWidth: 1,
    width: '50%',
    margin: 10,
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 20,
    flexShrink: 1,
  },
  btn: {
    width: Dimensions.get('window').width - 100,
    marginBottom: 25,
  },
});
