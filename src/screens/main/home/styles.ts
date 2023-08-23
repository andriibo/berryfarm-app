import {Dimensions, StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  deviceStateWrapper: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '10%',
  },
  deviceState: {
    fontSize: 17,
  },
  surface: {
    padding: 8,
    width: Dimensions.get('window').width / 3 + 30,
    margin: 10,
    height: Dimensions.get('window').height / 4,
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
