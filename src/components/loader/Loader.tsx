import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

import styles from './styles';

const Loader = () => (
  <View style={styles.container}>
    <ActivityIndicator color={styles.indicator.color} size="large" />
  </View>
);

export {Loader};
