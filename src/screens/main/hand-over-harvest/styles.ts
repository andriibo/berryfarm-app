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
    color: colors.onSurfaceVariant,
  },
  searchTextInputStyle: {
    fontSize: 22,
    height: 50,
    color: colors.onSurfaceVariant,
  },
  itemSeparatorStyle: {
    backgroundColor: colors.outlineVariant,
  },
  listItemContainerStyle: {
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  listItemLabelStyle: {
    fontSize: 22,
    color: colors.onSurfaceVariant,
  },
  dropDownPickerStyle: {
    backgroundColor: colors.background,
    borderRadius: 4,
    borderColor: colors.outline,
  },
  dropDownPickerTextStyle: {
    fontSize: 22,
    color: colors.onSurfaceVariant,
  },
});
