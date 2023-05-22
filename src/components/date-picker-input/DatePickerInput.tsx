import {faCalendarAlt} from '@fortawesome/free-solid-svg-icons';
import React, {memo} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {strings} from 'src/locales/locales';
import {IconButton} from '../icon-button';
import {styles} from './styles';

const DatePickerInput = memo(
  ({value, onPress}: {value: string; onPress: () => void}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={styles.inputContainer}>
        <Text style={value ? styles.input : [styles.input, styles.notActive]}>
          {value || strings.selectDate}
        </Text>
        <View style={styles.iconStyle} testID="calendarIconView">
          <IconButton
            icon={faCalendarAlt}
            onPress={onPress}
            size={25}
            testID="calendarIcon"
          />
        </View>
      </TouchableOpacity>
    );
  },
);

export {DatePickerInput};
