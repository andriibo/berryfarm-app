import {StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'space-around',
  },
  wrapper: {
    borderColor: colors.black,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'space-around',
    width: '90%',
    textAlign: 'center',
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
    width: '70%',
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
    width: '100%',
    backgroundColor: colors.background,
  },
});
