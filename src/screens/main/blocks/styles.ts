import {Dimensions, StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  area: {flex: 1, backgroundColor: colors.background},
  container: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingVertical: '5%',
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
  surfaceBlank: {
    width: Dimensions.get('window').width / 3 + 20,
    marginVertical: '3%',
    marginLeft: '2%',
    height: Dimensions.get('window').height / 3.7,
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
