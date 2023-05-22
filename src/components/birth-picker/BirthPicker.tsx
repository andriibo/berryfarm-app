import dayjs from 'dayjs';
import React, {useState} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Stack} from 'react-native-spacing-system';

import {showByFormat} from 'src/helpers/date-helper';
import {DatePickerInput} from '../date-picker-input';
import {maxDATE} from 'src/constants/constants';

type BirthPickerProps = {
  value: Date;
  onChange: (value: string) => void;
};

const BirthPicker = ({value, onChange}: BirthPickerProps) => {
  const [isDatePickerVisible, setIsDatePickerVisibility] = useState(false);

  const handlePicker = () => setIsDatePickerVisibility(prev => !prev);

  const handleConfirm = (date: Date) => {
    onChange(dayjs(date).toISOString());

    setIsDatePickerVisibility(false);
  };

  return (
    <>
      <DatePickerInput
        onPress={handlePicker}
        value={value && showByFormat(value, 'MMM DD, YYYY')}
      />
      {isDatePickerVisible && (
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          locale="en_GB"
          maximumDate={maxDATE}
          mode="date"
          onCancel={handlePicker}
          onConfirm={handleConfirm}
        />
      )}
      <Stack size={28} />
    </>
  );
};

export {BirthPicker};
