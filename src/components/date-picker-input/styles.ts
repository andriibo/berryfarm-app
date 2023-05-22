import {StyleSheet} from 'react-native';
import {isIOS} from 'src/constants/constants';

export const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    height: 50,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#202A31',
    borderRadius: 5,
  },
  input: {
    paddingTop: isIOS ? 10 : 15,
    bottom: isIOS ? 0 : 5,
    paddingLeft: 10,
    fontSize: 19,
    color: '#181D22',
    width: '100%',
    alignSelf: 'center',
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  notActive: {color: '#B5B5B5'},
  iconStyle: {
    position: 'absolute',
    right: 15,
    top: -5,
    color: '#B5B5B5',
    width: 40,
    height: 40,
  },
});
