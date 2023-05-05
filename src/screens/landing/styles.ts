import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from 'src/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingLeft: 30,
    paddingRight: 30,
  },
  image: {
    width: '90%',
    height: '50%',
  },
  subheading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 40,
    marginTop: -30,
  },
  btn: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgba(87,78,78,0.94)',
    padding: 10,
    borderStyle: 'solid',
    borderColor: 'rgba(87,78,78,0.94)',
    borderWidth: 1,
    borderRadius: 30,
    textAlign: 'center',
    width: Dimensions.get('window').width - 100,
    marginBottom: 25,
  },
  btnSelected: {
    color: Colors.black,
    backgroundColor: '#C4C0C0FF',
  },
  continue: {
    color: Colors.white,
    backgroundColor: '#565656',
    marginTop: 30,
  },
});
