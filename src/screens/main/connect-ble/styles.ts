import {StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  area: {flex: 1, backgroundColor: colors.background},
  boldTextStyle: {
    fontSize: 20,
    color: colors.black,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searching: {color: colors.white, fontSize: 17},
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
  itemText: {color: 'black', fontSize: 18},
});
