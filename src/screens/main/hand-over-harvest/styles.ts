import {StyleSheet} from 'react-native';
import {colors} from 'src/styles/colors';

export default StyleSheet.create({
  area: {flex: 1, backgroundColor: colors.background},
  container: {
    flexGrow: 1,
    paddingHorizontal: '7%',
    justifyContent: 'space-evenly',
  },
  weightIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  label: {
    fontWeight: 'bold',
    color: colors.outline,
    alignItems: 'center',
  },
  labelDisabled: {
    color: colors.outlineVariant,
  },
  labelManual: {
    alignItems: 'center',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
  btn: {
    borderRadius: 30,
    height: 50,
    width: '100%',
  },
  snackbar: {
    textAlign: 'center',
    color: colors.white,
  },
  searchContainerStyle: {
    height: 100,
    borderBottomColor: colors.outlineVariant,
  },
  searchTextInputStyle: {
    fontSize: 22,
    height: 50,
  },
  itemSeparatorStyle: {
    backgroundColor: colors.outlineVariant,
  },
  listItemContainerStyle: {
    height: 60,
    marginTop: 15,
  },
  listItemLabelStyle: {
    fontSize: 22,
    height: 50,
  },
  dropDownPickerStyle: {
    backgroundColor: colors.background,
    borderRadius: 4,
    borderColor: colors.outline,
  },
});
