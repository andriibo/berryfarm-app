import {StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},
  boldTextStyle: {
    fontSize: 20,
    color: colors.black,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  item: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  itemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  icon: {width: 22, height: 25, color: colors.black},
  itemText: {color: 'black', fontSize: 18},
  separator: {height: 1, backgroundColor: '#e0e0e0'},
});
