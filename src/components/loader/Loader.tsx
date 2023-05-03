import React from 'react';
import {ActivityIndicator, View} from 'react-native';

import styles from './styles';

const Loader = () => (
  <View style={styles.container}>
    <ActivityIndicator color={styles.indicator.color} size="large" />
  </View>
);

export {Loader};
