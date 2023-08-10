import {Dimensions, StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    justifyContent: 'space-around',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-around',
    width: '100%',
    textAlign: 'center',
  },
  btn: {
    width: Dimensions.get('window').width - 50,
    marginBottom: 25,
  },
});
