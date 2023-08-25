import {StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  area: {flex: 1, backgroundColor: colors.background},
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
    marginBottom: 25,
    borderRadius: 30,
    height: 50,
    width: '100%',
  },
});
