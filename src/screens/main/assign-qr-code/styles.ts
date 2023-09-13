import {StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    width: '100%',
    marginHorizontal: '5%',
  },
  wrapper: {
    borderColor: colors.onSurfaceVariant,
    borderRadius: 5,
    borderWidth: 1,
    width: '90%',
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
    height: 50,
    width: '90%',
    marginBottom: 25,
    borderRadius: 30,
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
    width: '90%',
    color: colors.onSurfaceVariant,
    backgroundColor: colors.background,
  },
});
