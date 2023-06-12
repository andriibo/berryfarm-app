import React from 'react';
import {IconButton} from 'react-native-paper';
import {colors} from 'src/styles/colors';
import {useNavigation} from '@react-navigation/native';

const HeaderLeft = () => {
  const navigation = useNavigation();

  return (
    <IconButton
      icon="arrow-left"
      iconColor={colors.white}
      onPress={navigation.goBack}
      size={20}
    />
  );
};

export {HeaderLeft};
