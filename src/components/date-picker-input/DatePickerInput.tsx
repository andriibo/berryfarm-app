import {IconButton} from 'react-native-paper';
import React, {memo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {strings} from 'src/locales/locales';
import {styles} from './styles';
import {colors} from 'src/styles/colors';

const DatePickerInput = memo(({value, onPress}: {value: string; onPress: () => void}) => {
  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress} style={styles.inputContainer}>
      <Text style={value ? styles.input : [styles.input, styles.notActive]}>{value || strings.selectDate}</Text>
      <View style={styles.iconStyle} testID="calendarIconView">
        <IconButton icon="calendar" iconColor={colors.primary} onPress={onPress} size={30} testID="calendarIcon" />
      </View>
    </TouchableOpacity>
  );
});

export {DatePickerInput};
