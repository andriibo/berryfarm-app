import {Dimensions, StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  wrapper: {
    borderColor: colors.black,
    borderRadius: 10,
    borderWidth: 1,
    width: '100%',
    textAlign: 'center',
  },
  label: {
    color: colors.outline,
  },
  item: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  titleItem: {
    margin: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    width: Dimensions.get('window').width - 50,
    marginBottom: 25,
  },
  linkCreateWorker: {
    margin: 10,
    marginBottom: 20,
    marginTop: 20,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  workerNotFound: {
    marginLeft: 30,
    marginTop: 20,
    color: colors.outline,
  },
  searchBar: {
    width: Dimensions.get('screen').width - 30,
    backgroundColor: colors.background,
  },
});
