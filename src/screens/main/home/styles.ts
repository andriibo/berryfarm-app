import {Dimensions, StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export const width = Dimensions.get('window').width / 3 - 20;

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    backgroundColor: colors.background,
    borderColor: colors.black,
    borderRadius: 10,
    borderWidth: 1,
    width,
    margin: 10,
    height: '80%',
  },
  titleWrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center',
  },
  titleText: {
    paddingBottom: 25,
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 20,
    flexShrink: 1,
  },
});
