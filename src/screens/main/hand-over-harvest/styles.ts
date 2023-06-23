import {Dimensions, StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '7%',
    justifyContent: 'space-evenly',
  },
  btn: {
    width: Dimensions.get('window').width - 100,
  },
});
