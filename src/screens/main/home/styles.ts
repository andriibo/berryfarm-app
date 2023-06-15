import {Dimensions, StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export const width = Dimensions.get('window').width / 3 + 30;

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
    height: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
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
    textAlign: 'center',
    paddingBottom: 25,
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 22,
    flexShrink: 1,
  },
  snackbar: {
    textAlign: 'center',
    color: colors.white,
  },
});
