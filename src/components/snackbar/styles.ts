import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {colors} from 'src/styles/colors';

interface Styles {
  wrapper: ViewStyle;
  toastWrapper: ViewStyle;
  message: TextStyle;
}

export default StyleSheet.create<Styles>({
  wrapper: {
    width: '100%',
    position: 'absolute',
    left: 0,
    zIndex: 9999,
  },
  toastWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  message: {
    flex: 1,
    fontSize: 18,
    color: colors.white,
    marginHorizontal: 12,
    paddingTop: 15,
  },
});
