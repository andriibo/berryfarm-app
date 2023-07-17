import {Dimensions, StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export const width = Dimensions.get('window').width / 3 + 40;

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  deviceStateWrapper: {
    height: 30,
    flexDirection: 'row',
    paddingLeft: 17,
    alignItems: 'center',
  },
  deviceState: {
    fontSize: 17,
  },
  surface: {
    padding: 8,
    width,
    margin: 10,
    height: '30%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryContainer,
  },
  titleWrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 5,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
  },
  titleText: {
    textAlign: 'center',
    paddingBottom: 25,
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 20,
    flexShrink: 1,
  },
  snackbar: {
    textAlign: 'center',
    color: colors.white,
  },
});
