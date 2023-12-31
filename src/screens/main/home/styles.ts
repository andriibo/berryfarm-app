import {Dimensions, StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  area: {flex: 1},
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  deviceStateWrapper: {
    height: '8%',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '10%',
  },
  deviceState: {
    fontSize: 18,
  },
  surface: {
    justifyContent: 'space-around',
    width: Dimensions.get('window').width / 3 + 20,
    marginVertical: '2%',
    marginLeft: '3%',
    height: Dimensions.get('window').height / 3.7,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 3,
  },
  titleWrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  titleText: {
    textAlign: 'center',
    paddingBottom: 15,
    color: colors.onSurfaceVariant,
    fontWeight: 'bold',
    fontSize: 20,
    flexShrink: 1,
  },
});
