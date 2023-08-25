import {Dimensions, StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '7%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  wrapper: {
    backgroundColor: colors.background,
    borderColor: colors.black,
    borderRadius: 10,
    borderWidth: 1,
    width: '90%',
    height: Dimensions.get('window').height / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
  titleText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 20,
    flexShrink: 1,
  },
  blockBtn: {
    marginTop: '20%',
    width: '100%',
  },
  btn: {
    borderRadius: 30,
    height: 50,
    width: '100%',
    marginBottom: 25,
  },
});
